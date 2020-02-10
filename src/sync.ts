import { isWebGL2, getWebGLContext } from "./context";

function checkSyncRecursively(gl: WebGL2RenderingContext, sync: WebGLSync, callback: (err?: Error) => void) {
  const syncv = gl.clientWaitSync(sync, 0, 0);
  switch (syncv) {
    case gl.ALREADY_SIGNALED:
      return callback(new Error("clientWaitSync: ALREADY_SIGNALED"));
    case gl.TIMEOUT_EXPIRED:
      requestAnimationFrame(() => checkSyncRecursively(gl, sync, callback));
      return;
    case gl.CONDITION_SATISFIED:
      return callback();
    case gl.WAIT_FAILED:
      return callback(new Error("clientWaitSync: WAIT_FAILED"));
  }
  return callback(new Error(`unexpected clientWaitSync: '${syncv}'`));
}

export function waitForSync() {
  return new Promise((resolve, reject) => {
    if (isWebGL2()) {
      const gl = getWebGLContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) return reject(new Error("unable to create WebGLSync"));
      checkSyncRecursively(gl, sync, (err?: Error) => (err ? reject(err) : resolve()));
    } else {
      const gl = getWebGLContext() as WebGLRenderingContext;
      gl.finish();
      resolve();
    }
  });
}

export function waitForSyncWithCallback(callback: (err?: Error) => void) {
  if (isWebGL2()) {
    const gl = getWebGLContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (!sync) return callback(new Error("unable to create WebGLSync"));
    checkSyncRecursively(gl, sync, callback);
  } else {
    getWebGLContext().finish();
    callback();
  }
}
