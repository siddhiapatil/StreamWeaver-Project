let ivm;

async function loadIsolate() {
  if (ivm !== undefined) return ivm;
  try { ivm = (await import('isolated-vm')).default; } catch { ivm = null; }
  return ivm;
}

// Input is deliberately limited to data and user code receives no require/process/network access.
export async function transformValue(code, value, row) {
  if (!code?.trim()) return value;
  const Isolate = await loadIsolate();
  if (!Isolate) throw new Error('Sandbox runtime is unavailable. Install isolated-vm before running transformations.');
  const isolate = new Isolate.Isolate({ memoryLimit: 8 });
  try {
    const context = await isolate.createContext();
    const jail = context.global;
    await jail.set('value', new Isolate.ExternalCopy(value).copyInto());
    await jail.set('row', new Isolate.ExternalCopy(row).copyInto());
    const script = await isolate.compileScript(`'use strict'; (async () => { const transform = (${code}); return await transform(value, row); })()`);
    return await script.run(context, { timeout: 50, result: { copy: true, promise: true } });
  } finally { isolate.dispose(); }
}
