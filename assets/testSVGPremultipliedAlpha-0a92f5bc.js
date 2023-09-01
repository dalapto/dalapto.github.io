import{b as A,m as v}from"./WGLContainer-aa602dc6.js";import{x as X,c as f,u as I}from"./VertexArrayObject-e8d657c2.js";import{D as g,L as m,F as Q,_ as R,E as S,G as U,U as x}from"./enums-b14466b3.js";import{e as p,T as M}from"./Texture-0b7a5f94.js";import{dY as P}from"./index-e410b1c2.js";let d=class{constructor(s,e,t,n,u,_,o,a,T){this.createQuery=s,this.deleteQuery=e,this.resultAvailable=t,this.getResult=n,this.disjoint=u,this.beginTimeElapsed=_,this.endTimeElapsed=o,this.createTimestamp=a,this.timestampBits=T}},i=!1;function N(r,s){if(s.disjointTimerQuery)return null;let e=r.getExtension("EXT_disjoint_timer_query_webgl2");return e&&A(r)?new d(()=>r.createQuery(),t=>{r.deleteQuery(t),i=!1},t=>r.getQueryParameter(t,r.QUERY_RESULT_AVAILABLE),t=>r.getQueryParameter(t,r.QUERY_RESULT),()=>r.getParameter(e.GPU_DISJOINT_EXT),t=>{i||(i=!0,r.beginQuery(e.TIME_ELAPSED_EXT,t))},()=>{r.endQuery(e.TIME_ELAPSED_EXT),i=!1},t=>e.queryCounterEXT(t,e.TIMESTAMP_EXT),()=>r.getQuery(e.TIMESTAMP_EXT,e.QUERY_COUNTER_BITS_EXT)):(e=r.getExtension("EXT_disjoint_timer_query"),e?new d(()=>e.createQueryEXT(),t=>{e.deleteQueryEXT(t),i=!1},t=>e.getQueryObjectEXT(t,e.QUERY_RESULT_AVAILABLE_EXT),t=>e.getQueryObjectEXT(t,e.QUERY_RESULT_EXT),()=>r.getParameter(e.GPU_DISJOINT_EXT),t=>{i||(i=!0,e.beginQueryEXT(e.TIME_ELAPSED_EXT,t))},()=>{e.endQueryEXT(e.TIME_ELAPSED_EXT),i=!1},t=>e.queryCounterEXT(t,e.TIMESTAMP_EXT),()=>e.getQueryEXT(e.TIMESTAMP_EXT,e.QUERY_COUNTER_BITS_EXT)):null)}class b{constructor(){this._result=!1}dispose(){this._program=P(this._program)}get result(){return this._program!=null&&(this._result=this._test(this._program),this.dispose()),this._result}}class j extends b{constructor(s){super(),this._rctx=s;const e=`
    precision highp float;

    attribute vec2 a_pos;
    varying vec2 v_uv;

    void main() {
      v_uv = a_pos;
      gl_Position = vec4(a_pos * 2.0 - 1.0, 0.0, 1.0);
    }
    `,t=`
    precision highp float;

    varying vec2 v_uv;

    uniform sampler2D u_texture;

    void main() {
      gl_FragColor = texture2D(u_texture, v_uv);
    }
    `;this._program=s.programCache.acquire(e,t,new Map([["a_pos",0]]))}dispose(){super.dispose()}_test(s){const e=this._rctx;if(!e.gl)return s.dispose(),!0;const t=new p(1);t.wrapMode=g.CLAMP_TO_EDGE,t.samplingMode=m.NEAREST;const n=new X(e,t),u=f.createVertex(e,Q.STATIC_DRAW,new Uint16Array([0,0,1,0,0,1,1,1])),_=new I(e,new Map([["a_pos",0]]),v,{geometry:u}),o=new p;o.samplingMode=m.LINEAR,o.wrapMode=g.CLAMP_TO_EDGE;const a=new M(e,o,E);e.useProgram(s),e.bindTexture(a,0),s.setUniform1i("u_texture",0);const T=e.getBoundFramebufferObject(),{x:c,y:h,width:y,height:w}=e.getViewport();e.bindFramebuffer(n),e.setViewport(0,0,1,1),e.setClearColor(0,0,0,0),e.setBlendingEnabled(!1),e.clearSafe(R.COLOR_BUFFER_BIT),e.bindVAO(_),e.drawArrays(S.TRIANGLE_STRIP,0,4);const l=new Uint8Array(4);return n.readPixels(0,0,1,1,U.RGBA,x.UNSIGNED_BYTE,l),_.dispose(),n.dispose(),a.dispose(),e.setViewport(c,h,y,w),e.bindFramebuffer(T),l[0]!==255}}const E=new Image;E.src="data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='5' height='5' version='1.1' viewBox='0 0 5 5' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='5' height='5' fill='%23f00' fill-opacity='.5'/%3E%3C/svg%3E%0A",E.width=5,E.height=5,E.decode();export{N as T,j as f,b as t};
