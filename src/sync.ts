import { isWebGL2, getWebGLContext } from "./context";

function checkSyncRecursively(gl: WebGL2RenderingContext, sync: WebGLSync, callback: (err?: Error) => void) {
  const syncv = gl.clientWaitSync(sync, gl.SYNC_FLUSH_COMMANDS_BIT, 0);
  switch (syncv) {
    case gl.ALREADY_SIGNALED:
      return callback();
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

export function nextFrameSync() {
  return new Promise((resolve, reject) => {
    if (isWebGL2()) {
      const gl = getWebGLContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) return reject(new Error("unable to create WebGLSync"));
      requestAnimationFrame(() =>
        checkSyncRecursively(gl, sync, (err?: Error) => {
          gl.deleteSync(sync);
          if (err) return reject(err);
          resolve();
        })
      );
    } else {
      requestAnimationFrame(() => (getWebGLContext().finish(), resolve()));
    }
  });
}

export function nextFrameSyncWithCallback(callback: (err?: Error) => void) {
  if (isWebGL2()) {
    const gl = getWebGLContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (!sync) return callback(new Error("unable to create WebGLSync"));
    requestAnimationFrame(() =>
      checkSyncRecursively(gl, sync, (err?: Error) => {
        gl.deleteSync(sync);
        if (err) throw err;
        callback();
      })
    );
  } else {
    requestAnimationFrame(() => (getWebGLContext().finish(), callback()));
  }
}
