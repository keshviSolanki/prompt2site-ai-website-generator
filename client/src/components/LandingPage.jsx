import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowUpRight, Mail, ExternalLink, Code2, Layers } from "lucide-react";

import { FaGithub } from "react-icons/fa";

export default function landingPage() {
  const mountRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const scrollRef = useRef(0);

  // Smooth cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // 1. Core Scene Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // High-end tone mapping for photorealistic light blowouts
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // Instead of loading a 40MB HDRI image, we draw a studio lighting setup on a canvas
    // and convert it to an environment map. This makes the glass look REAL.
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 512;
    envCanvas.height = 512;
    const ctx = envCanvas.getContext("2d");

    // Base dark environment
    ctx.fillStyle = "#030303";
    ctx.fillRect(0, 0, 512, 512);

    // Bright overhead softbox (White)
    const grd1 = ctx.createRadialGradient(256, 0, 20, 256, 0, 256);
    grd1.addColorStop(0, "#ffffff");
    grd1.addColorStop(1, "transparent");
    ctx.fillStyle = grd1;
    ctx.fillRect(0, 0, 512, 512);

    // Left rim light (Soft Cyan)
    const grd2 = ctx.createRadialGradient(0, 256, 10, 0, 256, 256);
    grd2.addColorStop(0, "#00e5ff");
    grd2.addColorStop(1, "transparent");
    ctx.fillStyle = grd2;
    ctx.fillRect(0, 0, 512, 512);

    // Right rim light (Warm Magenta)
    const grd3 = ctx.createRadialGradient(512, 256, 10, 512, 256, 256);
    grd3.addColorStop(0, "#ff007f");
    grd3.addColorStop(1, "transparent");
    ctx.fillStyle = grd3;
    ctx.fillRect(0, 0, 512, 512);

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTexture;

    // This is the secret to the "Apple Liquid Glass" look.
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 1.0, // Glass-like transparency
      ior: 1.52, // Index of Refraction (Real glass)
      reflectivity: 1.0,
      thickness: 2.5, // Refraction volume
      envMap: envTexture,
      envMapIntensity: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const geometry = new THREE.IcosahedronGeometry(2.2, 128); // High detail for smooth morphing
    const originalPositions = geometry.attributes.position.clone();

    const liquidDrop = new THREE.Mesh(geometry, glassMaterial);
    scene.add(liquidDrop);

    // Add glowing orbs behind the glass so we can see the refraction working
    const orbGeo = new THREE.SphereGeometry(1, 32, 32);

    const orb1 = new THREE.Mesh(
      orbGeo,
      new THREE.MeshBasicMaterial({ color: 0x00e5ff }),
    );
    orb1.position.set(-3, 2, -5);
    scene.add(orb1);

    const orb2 = new THREE.Mesh(
      orbGeo,
      new THREE.MeshBasicMaterial({ color: 0xff007f }),
    );
    orb2.position.set(3, -2, -6);
    scene.add(orb2);

    const orb3 = new THREE.Mesh(
      orbGeo,
      new THREE.MeshBasicMaterial({ color: 0x7000ff }),
    );
    orb3.position.set(0, 0, -8);
    orb3.scale.set(2, 2, 2);
    scene.add(orb3);

    const clock = new THREE.Clock();
    let targetX = 0;
    let targetY = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Calculate mouse position relative to center (-1 to 1)
      const mouseNormalizedX = (mousePos.x / window.innerWidth) * 2 - 1 || 0;
      const mouseNormalizedY = -(mousePos.y / window.innerHeight) * 2 + 1 || 0;

      // Smooth mouse interpolation
      targetX += (mouseNormalizedX - targetX) * 0.05;
      targetY += (mouseNormalizedY - targetY) * 0.05;

      // 1. Organic Fluid Morphing (The 4D Effect)
      const positions = geometry.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < positions.count; i++) {
        v.fromBufferAttribute(originalPositions, i);
        // Complex math to create flowing liquid waves
        const wave1 = Math.sin(v.x * 1.5 + time * 0.8);
        const wave2 = Math.cos(v.y * 1.5 + time * 0.9);
        const wave3 = Math.sin(v.z * 1.5 + time * 0.7);

        // Push vertices out based on wave math
        const displacement = wave1 * wave2 * wave3 * 0.4;
        v.addScaledVector(v.clone().normalize(), displacement);
        positions.setXYZ(i, v.x, v.y, v.z);
      }
      geometry.computeVertexNormals();
      positions.needsUpdate = true;

      // 2. Parallax and Rotation
      liquidDrop.rotation.y = time * 0.1 + targetX * 0.5;
      liquidDrop.rotation.z = time * 0.05;

      // Shift liquid drop based on scroll to move it out of the way of text
      const scrollProgress =
        scrollRef.current / (document.body.scrollHeight - window.innerHeight) ||
        0;

      // Choreograph the 3D object based on scroll position
      if (scrollProgress < 0.3) {
        // Hero section - Centered
        liquidDrop.position.x += (0 - liquidDrop.position.x) * 0.05;
        liquidDrop.position.y += (0 - liquidDrop.position.y) * 0.05;
      } else if (scrollProgress < 0.6) {
        // Work section - Shifted Right
        liquidDrop.position.x += (4 - liquidDrop.position.x) * 0.05;
        liquidDrop.position.y += (1 - liquidDrop.position.y) * 0.05;
      } else {
        // Contact section - Shifted Left and Down
        liquidDrop.position.x += (-3 - liquidDrop.position.x) * 0.05;
        liquidDrop.position.y += (-2 - liquidDrop.position.y) * 0.05;
      }

      orb1.position.x = Math.sin(time * 0.5) * 4 - 2;
      orb1.position.y = Math.cos(time * 0.3) * 3;

      orb2.position.x = Math.cos(time * 0.4) * 4 + 2;
      orb2.position.y = Math.sin(time * 0.6) * 3;

      // Camera parallax
      camera.position.x += (targetX * 2 - camera.position.x) * 0.02;
      camera.position.y += (targetY * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();
    setTimeout(() => setIsLoaded(true), 100);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // High-end tilt effect for project cards
  const handleCardMouseMove = (e, ref) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    ref.current.style.transition = "none";
  };

  const handleCardMouseLeave = (ref) => {
    if (!ref.current) return;
    ref.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    ref.current.style.transition =
      "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
  };

  // Card Refs
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  return (
    <div className="relative min-h-screen bg-[#030303] text-[#f5f5f7] font-sans overflow-x-hidden selection:bg-[#f5f5f7] selection:text-[#030303] cursor-none">
      {/* Liquid Custom Cursor */}
      <div
        className="fixed pointer-events-none z-50 mix-blend-difference transition-transform duration-75 ease-out flex items-center justify-center"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className={`w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 ${isHovering ? "scale-[1.5] bg-white/20" : "scale-100"}`}
        />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full" />
      </div>

      {/* 3D WebGL Background */}
      <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Soft Ambient Grain/Noise Overlay for extreme realism */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] bg-repeat" />

      <main
        className={`relative z-10 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        {/* Minimalist Navigation */}
        <nav className="fixed w-full top-0 p-8 flex justify-between items-center z-50 mix-blend-difference">
          <div className="text-xl font-medium tracking-tight">
            Alexander<span className="text-[#86868b]">.dev</span>
          </div>
          <div className="flex gap-8 text-sm tracking-wide text-[#86868b]">
            <a
              href="#work"
              className="hover:text-white transition-colors"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Work
            </a>
            <a
              href="#contact"
              className="hover:text-white transition-colors"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Contact
            </a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center px-8 md:px-24">
          <div className="max-w-5xl z-10 pointer-events-none">
            <p className="text-[#86868b] text-sm md:text-base mb-6 tracking-wide uppercase font-medium flex items-center gap-3">
              <Code2 size={18} /> Creative Engineer
            </p>
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-semibold leading-[1.05] tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-[#f5f5f7] to-[#86868b]">
              Engineering <br />
              the invisible.
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-[#86868b] font-normal leading-relaxed mb-12">
              I build hyper-realistic, high-performance web experiences. Merging
              advanced mathematics, physical materials, and flawless UI into
              digital masterpieces.
            </p>
          </div>
        </section>

        {/* Work / Archives Section */}
        <section id="work" className="min-h-screen py-32 px-8 md:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col mb-24">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                Selected Works
              </h2>
              <p className="text-[#86868b] text-lg">
                Hover to interact with the volume.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              {/* Project Card 1 */}
              <div
                ref={card1Ref}
                onMouseMove={(e) => handleCardMouseMove(e, card1Ref)}
                onMouseLeave={() => handleCardMouseLeave(card1Ref)}
                onMouseEnter={() => setIsHovering(true)}
                className="group relative rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden p-8 flex flex-col justify-end h-[500px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] transform-gpu transition-all duration-500 will-change-transform"
              >
                <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <ArrowUpRight size={20} />
                </div>
                <div className="relative z-10">
                  <p className="text-[#86868b] text-sm tracking-wider mb-3">
                    2026 &mdash; E-Commerce
                  </p>
                  <h3 className="text-3xl font-semibold mb-4 text-white">
                    Lumina Optics
                  </h3>
                  <p className="text-[#86868b] font-normal">
                    Advanced WebGL product configurator featuring real-time
                    glass dispersion and caustics.
                  </p>
                </div>
                {/* Subtle gradient glow inside card */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#00e5ff]/10 blur-[80px] rounded-full pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity duration-500" />
              </div>

              {/* Project Card 2 (Offset) */}
              <div
                ref={card2Ref}
                onMouseMove={(e) => handleCardMouseMove(e, card2Ref)}
                onMouseLeave={() => handleCardMouseLeave(card2Ref)}
                onMouseEnter={() => setIsHovering(true)}
                className="group relative rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden p-8 flex flex-col justify-end h-[500px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] transform-gpu transition-all duration-500 will-change-transform md:mt-24"
              >
                <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <ArrowUpRight size={20} />
                </div>
                <div className="relative z-10">
                  <p className="text-[#86868b] text-sm tracking-wider mb-3">
                    2025 &mdash; FinTech
                  </p>
                  <h3 className="text-3xl font-semibold mb-4 text-white">
                    Aura Banking
                  </h3>
                  <p className="text-[#86868b] font-normal">
                    Frictionless financial dashboards built with React, Framer
                    Motion, and absolute precision.
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#ff007f]/10 blur-[80px] rounded-full pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity duration-500" />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="min-h-screen flex items-center justify-center py-32 px-8 relative"
        >
          <div className="max-w-2xl w-full text-center z-10 p-12 md:p-16 rounded-[2rem] border border-white/10 bg-white/[0.01] backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <Layers
              className="mx-auto text-white mb-8"
              size={48}
              strokeWidth={1.5}
            />
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
              Let's build reality.
            </h2>
            <p className="text-[#86868b] text-lg mb-12">
              Currently accepting new opportunities. Whether it's a massive
              scale product or a high-end experiential site.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="mailto:hello@example.com"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="group relative px-8 py-4 bg-white text-black rounded-full overflow-hidden flex items-center justify-center gap-3 font-medium transition-transform hover:scale-105"
              >
                <Mail size={18} />
                Send a Message
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="group px-8 py-4 bg-transparent border border-white/20 text-white rounded-full flex items-center justify-center gap-3 font-medium transition-all hover:bg-white/10 hover:border-white/40"
              >
                <FaGithub size={18} />
                GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-sm font-medium tracking-wide text-[#86868b] border-t border-white/10 mix-blend-difference relative z-10">
          © {new Date().getFullYear()} Alexander.dev — Crafted with logic and
          light.
        </footer>
      </main>
    </div>
  );
}
