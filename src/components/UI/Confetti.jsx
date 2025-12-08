import React, { useEffect, useRef } from 'react';

const Confetti = ({ fire }) => {
    const canvasRef = useRef(null);

    // Theme colors matching the application
    const colors = [
        '#fa4d4d', // primary-orange
        '#377cfb', // primary-blue
        '#40E0D0', // teal-marker
        '#27ae60', // split-green
        '#f1c40f', // yellow/gold
        '#e74c3c'  // split-red
    ];

    useEffect(() => {
        if (fire) {
            const canvas = canvasRef.current;
            canvas.style.display = 'block';
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            let particles = [];
            // Create 200 particles
            for (let i = 0; i < 300; i++) {
                particles.push({
                    x: Math.random() * canvas.width, // Horizontal starting position
                    y: Math.random() * -canvas.height * 1.2 - 50, // Vertical start (above screen)

                    // Velocity (Speed & Direction)
                    vx: (Math.random() - 0.5) * 8, // Horizontal velocity (drift left/right)
                    vy: Math.random() * 10 + 12,   // Vertical velocity (falling speed)

                    color: colors[Math.floor(Math.random() * colors.length)],

                    // Animation Properties
                    life: 180,    // Duration in frames (approx 3.3s at 60fps)
                    gravity: 0.7, // Downward acceleration (heavier feel)
                    drag: 0.96,   // Air resistance (slows movement slightly over time)

                    // Appearance
                    size: Math.random() * 8 + 4, // Size of the circle

                    // Rotation (Spin)
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 10,

                    // Wavy Motion (Oscillation)
                    oscillationSpeed: Math.random() * 0.1 + 0.05, // How fast it waves back and forth
                    oscillationAmplitude: Math.random() * 2 + 1   // How wide the wave is
                });
            }

            const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach((p, i) => {
                    // Update Position
                    // x position = current x + velocity x + wavy motion offset
                    p.x += p.vx + Math.cos(p.life * p.oscillationSpeed) * p.oscillationAmplitude;
                    p.y += p.vy; // y position = current y + velocity y

                    // Apply Physics
                    p.vy += p.gravity; // Gravity increases falling speed
                    p.vx *= p.drag;    // Drag reduces horizontal speed (air resistance)
                    p.vy *= p.drag;    // Drag reduces vertical speed (terminal velocity)

                    p.rotation += p.rotationSpeed; // Update rotation
                    p.life--; // Decrease life counter

                    // Draw Particle
                    ctx.fillStyle = p.color;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);

                    // Draw Circle
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();

                    // Remove dead particles
                    if (p.life <= 0) particles.splice(i, 1);
                });

                if (particles.length > 0) {
                    requestAnimationFrame(animate);
                } else {
                    canvas.style.display = 'none';
                }
            };
            animate();
        }
    }, [fire]);

    return <canvas id="confetti-canvas" ref={canvasRef}></canvas>;
};

export default Confetti;
