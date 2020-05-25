import {
  getWebGLContext,
  getMaxVertexAttribs,
  getInstanceExtension,
  getVAOExtension,
  getCombinedTextureImageUnits
} from "./context";

export interface TextureInfo {
  activeTexture: number;
  textureUnits: {
    texture2D: WebGLTexture | null;
    textureCubemap: WebGLTexture | null;
  }[];
}

export function getTextureInfo() {
  const gl = getWebGLContext();
  const maxTex = getCombinedTextureImageUnits();
  return {
    activeTexture: gl.getParameter(gl.ACTIVE_TEXTURE),
    textureUnits: Array.from(new Array(maxTex), (_, i) => {
      gl.activeTexture(gl.TEXTURE0 + i + 1);
      return {
        texture2D: gl.getParameter(gl.TEXTURE_BINDING_2D),
        textureCubemap: gl.getParameter(gl.TEXTURE_BINDING_CUBE_MAP)
      };
    })
  } as TextureInfo;
}

export function setTextureInfo(info: TextureInfo) {
  const gl = getWebGLContext();
  const maxTex = getCombinedTextureImageUnits();
  for (let i = 0; i < maxTex; ++i) {
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, info.textureUnits[i].texture2D);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, info.textureUnits[i].textureCubemap);
  }
  gl.activeTexture(info.activeTexture);
}

export function resetTextureInfo() {
  const gl = getWebGLContext();
  const maxTex = getCombinedTextureImageUnits();
  for (let i = 0; i < maxTex; ++i) {
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  }
  gl.activeTexture(gl.TEXTURE0);
}

export interface BindingInfo {
  arrayBuffer: WebGLBuffer;
  renderbuffer: WebGLRenderbuffer | null;
  framebuffer: WebGLFramebuffer | null;
}

export function getBindingInfo() {
  const gl = getWebGLContext();
  return {
    arrayBuffer: gl.getParameter(gl.ARRAY_BUFFER_BINDING),
    renderbuffer: gl.getParameter(gl.RENDERBUFFER_BINDING),
    framebuffer: gl.getParameter(gl.FRAMEBUFFER_BINDING)
  } as BindingInfo;
}

export function setBindingInfo(info: BindingInfo) {
  const gl = getWebGLContext();
  gl.bindBuffer(gl.ARRAY_BUFFER, info.arrayBuffer);
  gl.bindRenderbuffer(gl.RENDERBUFFER, info.renderbuffer);
  gl.bindFramebuffer(gl.FRAMEBUFFER, info.framebuffer);
}

export function resetBindingInfo() {
  const gl = getWebGLContext();
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

export interface AttributeInfo {
  vertexArray?: WebGLVertexArrayObject;
  attributes: {
    buffer: WebGLBuffer;
    enabled: boolean;
    size: number;
    stride: number;
    type: number;
    normalized: boolean;
    value: Float32Array;
    offset: number;
    divisor?: number;
  }[];
  elementArrayBuffer: WebGLBuffer;
}

export function getAttributeInfo() {
  const gl = getWebGLContext();
  const vaoExt = getVAOExtension();
  const instExt = getInstanceExtension();
  return {
    vertexArray: vaoExt ? gl.getParameter(vaoExt.VERTEX_ARRAY_BINDING_OES) : undefined,
    attributes: Array.from(new Array(getMaxVertexAttribs()), (_, i) => {
      return {
        buffer: gl.getVertexAttrib(i + 1, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING),
        enabled: gl.getVertexAttrib(i + 1, gl.VERTEX_ATTRIB_ARRAY_ENABLED),
        size: gl.getVertexAttrib(i + 1, gl.VERTEX_ATTRIB_ARRAY_SIZE),
        stride: gl.getVertexAttrib(i + 1, gl.VERTEX_ATTRIB_ARRAY_STRIDE),
        type: gl.getVertexAttrib(i + 1, gl.VERTEX_ATTRIB_ARRAY_TYPE),
        normalized: gl.getVertexAttrib(i + 1, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED),
        value: gl.getVertexAttrib(i + 1, gl.CURRENT_VERTEX_ATTRIB),
        offset: gl.getVertexAttribOffset(i + 1, gl.VERTEX_ATTRIB_ARRAY_POINTER),
        divisor: instExt ? gl.getVertexAttrib(i + 1, instExt.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE) : undefined
      };
    }),
    elementArrayBuffer: gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING)
  } as AttributeInfo;
}

export function setAttributeInfo(x: AttributeInfo) {
  const gl = getWebGLContext();
  const vaoExt = getVAOExtension();
  if (vaoExt && x.vertexArray) vaoExt.bindVertexArrayOES(x.vertexArray);
  const instExt = getInstanceExtension();
  for (let i = 0; i < getMaxVertexAttribs(); ++i) {
    if (x.attributes[i].enabled) {
      gl.enableVertexAttribArray(i);
    } else {
      gl.disableVertexAttribArray(i);
    }
    gl.vertexAttrib4fv(i, x.attributes[i].value);
    gl.bindBuffer(gl.ARRAY_BUFFER, x.attributes[i].buffer);
    gl.vertexAttribPointer(
      i,
      x.attributes[i].size,
      x.attributes[i].type,
      x.attributes[i].normalized,
      x.attributes[i].stride,
      x.attributes[i].offset
    );
    if (instExt) instExt.vertexAttribDivisorANGLE(i, x.attributes[i].divisor as number);
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, x.elementArrayBuffer);
}

export function resetAttributeInfo() {
  const gl = getWebGLContext();
  const vaoExt = getVAOExtension();
  if (vaoExt) vaoExt.bindVertexArrayOES(null);
  for (let i = 0; i < getMaxVertexAttribs(); ++i) {
    gl.disableVertexAttribArray(i);
    gl.vertexAttribPointer(i, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttrib1f(i, 0);
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

export interface FlagInfo {
  blend: boolean;
  cullFace: boolean;
  depthTest: boolean;
  dither: boolean;
  polygonOffsetFill: boolean;
  sampleAlphaToCoverage: boolean;
  sampleCoverage: boolean;
  scissorTest: boolean;
  stencilTest: boolean;
}

export function getFlagInfo() {
  const gl = getWebGLContext();
  return {
    blend: gl.getParameter(gl.BLEND),
    cullFace: gl.getParameter(gl.CULL_FACE),
    depthTest: gl.getParameter(gl.DEPTH_TEST),
    dither: gl.getParameter(gl.DITHER),
    polygonOffsetFill: gl.getParameter(gl.POLYGON_OFFSET_FILL),
    sampleAlphaToCoverage: gl.getParameter(gl.SAMPLE_ALPHA_TO_COVERAGE),
    sampleCoverage: gl.getParameter(gl.SAMPLE_COVERAGE),
    scissorTest: gl.getParameter(gl.SCISSOR_TEST)
  } as FlagInfo;
}

export function setFlagInfo(info: FlagInfo) {
  const gl = getWebGLContext();
  info.blend ? gl.enable(gl.BLEND) : gl.disable(gl.BLEND);
  info.cullFace ? gl.enable(gl.CULL_FACE) : gl.disable(gl.CULL_FACE);
  info.depthTest ? gl.enable(gl.DEPTH_TEST) : gl.disable(gl.DEPTH_TEST);
  info.dither ? gl.enable(gl.DITHER) : gl.disable(gl.DITHER);
  info.polygonOffsetFill ? gl.enable(gl.POLYGON_OFFSET_FILL) : gl.disable(gl.POLYGON_OFFSET_FILL);
  info.sampleAlphaToCoverage ? gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE) : gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
  info.sampleCoverage ? gl.enable(gl.SAMPLE_COVERAGE) : gl.disable(gl.SAMPLE_COVERAGE);
  info.scissorTest ? gl.enable(gl.SCISSOR_TEST) : gl.disable(gl.SCISSOR_TEST);
}

export function resetFlagInfo() {
  const gl = getWebGLContext();
  gl.disable(gl.BLEND);
  gl.disable(gl.CULL_FACE);
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.DITHER);
  gl.disable(gl.POLYGON_OFFSET_FILL);
  gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
  gl.disable(gl.SAMPLE_COVERAGE);
  gl.disable(gl.SCISSOR_TEST);
}

export interface PixelStoreInfo {
  packAlignment: number;
  unpackAlignment: number;
  unpackColorspaceConversion: number;
  unpackFlipY: boolean;
  unpackPremultiplyAlpha: boolean;
}

export function getPixelStoreInfo() {
  const gl = getWebGLContext();
  return {
    packAlignment: gl.getParameter(gl.PACK_ALIGNMENT),
    unpackAlignment: gl.getParameter(gl.UNPACK_ALIGNMENT),
    unpackColorspaceConversion: gl.getParameter(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL),
    unpackFlipY: gl.getParameter(gl.UNPACK_FLIP_Y_WEBGL),
    unpackPremultiplyAlpha: gl.getParameter(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL)
  } as PixelStoreInfo;
}

export function setPixelStoreInfo(info: PixelStoreInfo) {
  const gl = getWebGLContext();
  gl.pixelStorei(gl.PACK_ALIGNMENT, info.packAlignment);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, info.unpackAlignment);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, info.unpackColorspaceConversion);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, info.unpackFlipY);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, info.unpackPremultiplyAlpha);
}

export function resetPixelStoreInfo() {
  const gl = getWebGLContext();
  gl.pixelStorei(gl.PACK_ALIGNMENT, 4);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.BROWSER_DEFAULT_WEBGL);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
}

// currentProgram: WebGLProgram | null;

export function getCurrentProgram() {
  const gl = getWebGLContext();
  return gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram | null;
}

export function setCurrentProgram(program: WebGLProgram | null) {
  return getWebGLContext().useProgram(program);
}

export function resetCurrentProgram() {
  getWebGLContext().useProgram(null);
}

export function getViewport() {
  const gl = getWebGLContext();
  return gl.getParameter(gl.VIEWPORT) as Int32Array;
}

export function setViewport(arr: Int32Array) {
  return getWebGLContext().viewport(arr[0], arr[1], arr[2], arr[3]);
}

export function resetViewport() {
  const gl = getWebGLContext();
  if (gl.canvas && gl.canvas.width && gl.canvas.height) gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

export function getScissorBox() {
  const gl = getWebGLContext();
  return gl.getParameter(gl.SCISSOR_BOX) as Int32Array;
}

export function setScissorBox(arr: Int32Array) {
  return getWebGLContext().scissor(arr[0], arr[1], arr[2], arr[3]);
}

export function resetScissorBox() {
  const gl = getWebGLContext();
  if (gl.canvas && gl.canvas.width && gl.canvas.height) gl.scissor(0, 0, gl.canvas.width, gl.canvas.height);
}

export interface OtherInfo {
  blendSrcRgb: number;
  blendDstRgb: number;
  blendSrcAlpha: number;
  blendDstAlpha: number;
  blendEquationRgb: number;
  blendEquationAlpha: number;
  blendColor: Float32Array;
  colorClearValue: Float32Array;
  colorWriteMask: boolean[];
  cullFaceMode: number;
  depthClearValue: number;
  depthFunc: number;
  depthRange: Float32Array;
  depthWriteMask: boolean;
  frontFace: number;
  generateMipmapHint: number;
  lineWidth: number;
  polygonOffsetFactor: number;
  polygonOffsetUnits: number;
  sampleCoverageValue: number;
  sampleCoverageInvert: false;
  stencilBackFail: number;
  stencilBackFunc: number;
  stencilBackPassDepthFail: number;
  stencilBackPassDepthPass: number;
  stencilBackRef: number;
  stencilBackValueMask: number;
  stencilBackWriteMask: number;
  stencilClearValue: number;
  stencilFail: number;
  stencilFunc: number;
  stencilPassDepthFail: number;
  stencilPassDepthPass: number;
  stencilRef: number;
  stencilValueMask: number;
  stencilWriteMask: number;
}

export function getOtherInfo() {
  const gl = getWebGLContext();
  return {
    blendSrcRgb: gl.getParameter(gl.BLEND_SRC_RGB),
    blendDstRgb: gl.getParameter(gl.BLEND_DST_RGB),
    blendSrcAlpha: gl.getParameter(gl.BLEND_SRC_ALPHA),
    blendDstAlpha: gl.getParameter(gl.BLEND_DST_ALPHA),
    blendEquationRgb: gl.getParameter(gl.BLEND_EQUATION_RGB),
    blendEquationAlpha: gl.getParameter(gl.BLEND_EQUATION_ALPHA),
    blendColor: gl.getParameter(gl.BLEND_COLOR),
    colorClearValue: gl.getParameter(gl.COLOR_CLEAR_VALUE),
    colorWriteMask: gl.getParameter(gl.COLOR_WRITEMASK),
    cullFaceMode: gl.getParameter(gl.CULL_FACE_MODE),
    depthClearValue: gl.getParameter(gl.DEPTH_CLEAR_VALUE),
    depthFunc: gl.getParameter(gl.DEPTH_FUNC),
    depthRange: gl.getParameter(gl.DEPTH_RANGE),
    depthWriteMask: gl.getParameter(gl.DEPTH_WRITEMASK),
    frontFace: gl.getParameter(gl.FRONT_FACE),
    generateMipmapHint: gl.getParameter(gl.GENERATE_MIPMAP_HINT),
    lineWidth: gl.getParameter(gl.LINE_WIDTH),
    polygonOffsetFactor: gl.getParameter(gl.POLYGON_OFFSET_FACTOR),
    polygonOffsetUnits: gl.getParameter(gl.POLYGON_OFFSET_UNITS),
    sampleCoverageValue: gl.getParameter(gl.SAMPLE_COVERAGE_VALUE),
    sampleCoverageInvert: gl.getParameter(gl.SAMPLE_COVERAGE_INVERT),
    stencilBackFail: gl.getParameter(gl.STENCIL_BACK_FAIL),
    stencilBackFunc: gl.getParameter(gl.STENCIL_BACK_FUNC),
    stencilBackPassDepthFail: gl.getParameter(gl.STENCIL_BACK_PASS_DEPTH_FAIL),
    stencilBackPassDepthPass: gl.getParameter(gl.STENCIL_BACK_PASS_DEPTH_PASS),
    stencilBackRef: gl.getParameter(gl.STENCIL_BACK_REF),
    stencilBackValueMask: gl.getParameter(gl.STENCIL_BACK_VALUE_MASK),
    stencilBackWriteMask: gl.getParameter(gl.STENCIL_BACK_WRITEMASK),
    stencilClearValue: gl.getParameter(gl.STENCIL_CLEAR_VALUE),
    stencilFail: gl.getParameter(gl.STENCIL_FAIL),
    stencilFunc: gl.getParameter(gl.STENCIL_FUNC),
    stencilPassDepthFail: gl.getParameter(gl.STENCIL_PASS_DEPTH_FAIL),
    stencilPassDepthPass: gl.getParameter(gl.STENCIL_PASS_DEPTH_PASS),
    stencilRef: gl.getParameter(gl.STENCIL_REF),
    stencilValueMask: gl.getParameter(gl.STENCIL_VALUE_MASK),
    stencilWriteMask: gl.getParameter(gl.STENCIL_WRITEMASK)
  } as OtherInfo;
}

export function setOtherInfo(info: OtherInfo) {
  const gl = getWebGLContext();
  gl.blendFuncSeparate(info.blendSrcRgb, info.blendDstRgb, info.blendSrcAlpha, info.blendDstAlpha);
  gl.blendEquationSeparate(info.blendEquationRgb, info.blendEquationAlpha);
  gl.blendColor(info.blendColor[0], info.blendColor[1], info.blendColor[2], info.blendColor[3]);
  gl.clearColor(info.colorClearValue[0], info.colorClearValue[1], info.colorClearValue[2], info.colorClearValue[3]);
  gl.colorMask(info.colorWriteMask[0], info.colorWriteMask[1], info.colorWriteMask[2], info.colorWriteMask[3]);
  gl.cullFace(info.cullFaceMode);
  gl.clearDepth(info.depthClearValue);
  gl.depthFunc(info.depthFunc);
  gl.depthRange(info.depthRange[0], info.depthRange[1]);
  gl.depthMask(info.depthWriteMask);
  gl.frontFace(info.frontFace);
  gl.hint(gl.GENERATE_MIPMAP_HINT, info.generateMipmapHint);
  gl.lineWidth(info.lineWidth);
  gl.polygonOffset(info.polygonOffsetFactor, info.polygonOffsetUnits);
  gl.sampleCoverage(info.sampleCoverageValue, info.sampleCoverageInvert);
  gl.stencilFuncSeparate(gl.BACK, info.stencilBackFunc, info.stencilBackRef, info.stencilBackValueMask);
  gl.stencilFuncSeparate(gl.FRONT, info.stencilFunc, info.stencilRef, info.stencilValueMask);
  gl.stencilOpSeparate(gl.BACK, info.stencilBackFail, info.stencilBackPassDepthFail, info.stencilBackPassDepthPass);
  gl.stencilOpSeparate(gl.FRONT, info.stencilFail, info.stencilPassDepthFail, info.stencilPassDepthPass);
  gl.stencilMaskSeparate(gl.BACK, info.stencilBackWriteMask);
  gl.stencilMaskSeparate(gl.FRONT, info.stencilWriteMask);
  gl.clearStencil(info.stencilClearValue);
}

export function resetOtherInfo() {
  const gl = getWebGLContext();
  gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
  gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
  gl.blendColor(0, 0, 0, 0);
  gl.clearColor(0, 0, 0, 0);
  gl.colorMask(true, true, true, true);
  gl.cullFace(gl.BACK);
  gl.clearDepth(1);
  gl.depthFunc(gl.LESS);
  gl.depthRange(0, 1);
  gl.depthMask(true);
  gl.frontFace(gl.CCW);
  gl.hint(gl.GENERATE_MIPMAP_HINT, gl.DONT_CARE);
  gl.lineWidth(1);
  gl.polygonOffset(0, 0);
  gl.sampleCoverage(1, false);
  gl.stencilFuncSeparate(gl.FRONT_AND_BACK, gl.ALWAYS, 0, 1);
  gl.stencilOpSeparate(gl.FRONT_AND_BACK, gl.KEEP, gl.KEEP, gl.KEEP);
  gl.stencilMaskSeparate(gl.FRONT_AND_BACK, 1);
  gl.clearStencil(0);
}

export interface State {
  textureInfo: TextureInfo;
  bindingInfo: BindingInfo;
  attributeInfo: AttributeInfo;
  flagInfo: FlagInfo;
  pixelStoreInfo: PixelStoreInfo;
  currentProgram: WebGLProgram | null;
  viewport: Int32Array;
  scissorBox: Int32Array;
  otherInfo: OtherInfo;
}

export function getState() {
  return {
    textureInfo: getTextureInfo(),
    bindingInfo: getBindingInfo(),
    attributeInfo: getAttributeInfo(),
    flagInfo: getFlagInfo(),
    pixelStoreInfo: getPixelStoreInfo(),
    currentProgram: getCurrentProgram(),
    viewport: getViewport(),
    scissorBox: getScissorBox(),
    otherInfo: getOtherInfo()
  } as State;
}

export function setState(state: State) {
  setTextureInfo(state.textureInfo);
  setBindingInfo(state.bindingInfo);
  setAttributeInfo(state.attributeInfo);
  setFlagInfo(state.flagInfo);
  setPixelStoreInfo(state.pixelStoreInfo);
  setCurrentProgram(state.currentProgram);
  setViewport(state.viewport);
  setScissorBox(state.scissorBox);
  setOtherInfo(state.otherInfo);
}

export function resetState() {
  resetTextureInfo();
  resetBindingInfo();
  resetAttributeInfo();
  resetFlagInfo();
  resetPixelStoreInfo();
  resetCurrentProgram();
  resetViewport();
  resetScissorBox();
  resetOtherInfo();
}
