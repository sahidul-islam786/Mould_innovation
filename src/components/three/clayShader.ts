// "Digital clay" shader. A unit sphere is displaced by noise (raw clay) and can morph into a
// pointy-top hexagonal prism (the logo's hexagon). The pointer presses a dent into the surface.
// Colour runs from the logo red to the logo maroon across x, like the logo's "M".

// 3D simplex noise — Ashima Arts / Stefan Gustavson (MIT license).
const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

export const clayVertex = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uSpeed;
uniform float uMorph;
uniform float uTwist;
uniform float uStretch;
uniform float uPress;
uniform vec3 uPointer;

varying vec3 vNormalV;
varying vec3 vViewPos;
varying float vX;
varying float vNoise;
varying vec3 vPos;

${noise}

float gNoise;

vec3 shape(vec3 dir){
  float t = uTime * uSpeed;
  float n = snoise(dir * uFreq + vec3(0.0, 0.0, t));
  n += 0.5 * snoise(dir * uFreq * 2.3 + vec3(t * 0.7));
  gNoise = n;

  // Raw clay: displaced sphere, optional stretch and twist.
  vec3 clay = dir * (1.0 + n * uAmp);
  clay.y *= uStretch;
  float a = clay.y * uTwist;
  clay.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * clay.xz;

  // Formed: pointy-top hexagonal prism (flat sides left/right), slightly soft.
  // Smooth max/min round the edges slightly so they read crisp without faceting artefacts.
  vec2 d = dir.xy;
  float k = 18.0;
  float a1 = abs(d.x), a2 = abs(dot(d, vec2(0.5, 0.8660254))), a3 = abs(dot(d, vec2(-0.5, 0.8660254)));
  float m = log(exp(k * a1) + exp(k * a2) + exp(k * a3)) / k - 0.02;
  float tHex = 0.95 / max(m, 1e-3);
  float tZ = 0.38 / max(abs(dir.z), 1e-3);
  float tt = -log(exp(-10.0 * tHex) + exp(-10.0 * tZ)) / 10.0;
  vec3 hex = dir * tt * (1.0 + n * uAmp * 0.06);

  vec3 p = mix(clay, hex, uMorph);

  // Pointer press: a soft dent where the cursor is.
  float kp = smoothstep(0.75, 0.0, distance(p, uPointer));
  p -= normalize(p) * uPress * 0.32 * kp;
  return p;
}

void main(){
  vec3 dir = normalize(position);
  vec3 p = shape(dir);
  float n0 = gNoise;

  // Normal from two neighbouring samples on the sphere.
  vec3 up = abs(dir.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 tan = normalize(cross(up, dir));
  vec3 bit = normalize(cross(dir, tan));
  float e = 0.012;
  vec3 pt = shape(normalize(dir + tan * e));
  vec3 pb = shape(normalize(dir + bit * e));
  vec3 nrm = normalize(cross(pt - p, pb - p));

  vNoise = n0;
  vX = p.x;
  vPos = p;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vViewPos = mv.xyz;
  vNormalV = normalize(normalMatrix * nrm);
  gl_Position = projectionMatrix * mv;
}
`;

// Black glass / chrome shell with red light living inside it (art direction: glossy black,
// clear glass edges, internal red veins). Reflections come from a procedural studio environment.
export const clayFragment = /* glsl */ `
uniform vec3 uRed;
uniform vec3 uMaroon;
uniform vec3 uRim;
uniform float uGlow;
uniform float uTime;
uniform float uHeat;

varying vec3 vNormalV;
varying vec3 vViewPos;
varying float vX;
varying float vNoise;
varying vec3 vPos;

${noise}

// Studio environment: two softboxes overhead, a dim horizon strip, dark floor.
vec3 env(vec3 r){
  float top = smoothstep(0.35, 0.9, r.y);
  float box1 = smoothstep(0.75, 0.95, 1.0 - abs(r.x + 0.35) * 1.6) * top;
  float box2 = smoothstep(0.8, 0.98, 1.0 - abs(r.x - 0.55) * 2.4) * smoothstep(0.1, 0.6, r.y);
  float horizon = exp(-pow(r.y * 6.0, 2.0)) * 0.18;
  float floorShade = smoothstep(0.0, -0.8, r.y) * 0.02;
  vec3 c = vec3(1.0) * (box1 * 1.3 + box2 * 0.7 + horizon) + floorShade;
  // a faint red bounce from below, as if the red core lights the room
  c += uRed * smoothstep(-0.2, -0.9, r.y) * 0.25 * uHeat;
  return c;
}

void main(){
  vec3 N = normalize(vNormalV);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(-vViewPos);
  float NdV = clamp(dot(N, V), 0.0, 1.0);

  // Fresnel (dielectric glass, F0 = 0.04).
  float F = 0.04 + 0.96 * pow(1.0 - NdV, 5.0);

  // Internal red: thin glowing veins plus a deep core, seen through the glass.
  vec3 q = vPos * 1.35 + vec3(0.0, uTime * 0.1, uTime * 0.04);
  // Veins only inside a slowly moving region, so most of the shell stays black glass.
  float mask = smoothstep(0.05, 0.55, snoise(vPos * 0.7 + vec3(uTime * 0.05, 0.0, 0.0)));
  float vein = pow(1.0 - abs(snoise(q)), 22.0) * mask;
  float vein2 = pow(1.0 - abs(snoise(q * 2.3 + 4.0)), 30.0) * mask;
  float core = pow(NdV, 2.2);
  float g = smoothstep(-0.9, 0.9, vX);
  vec3 red = mix(uRed, uMaroon, g * 0.6);
  vec3 inner = red * (vein * 2.2 + vein2 * 1.2 + core * 0.06 * mask) * uHeat * (1.0 - F * 0.7);

  // Glossy black body + chrome-like reflection.
  vec3 R = reflect(-V, N);
  vec3 refl = env(R);
  vec3 body = vec3(0.012, 0.010, 0.012);
  vec3 col = body + inner + refl * mix(0.10, 1.0, F) * 1.15;

  // Clear glass rim and a touch of red rim light.
  col += vec3(0.85, 0.85, 0.9) * pow(1.0 - NdV, 3.0) * 0.18;
  col += uRim * pow(1.0 - NdV, 2.5) * (0.12 + uGlow * 0.5);

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
