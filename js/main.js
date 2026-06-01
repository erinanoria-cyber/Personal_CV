function sanitizeInput(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

AOS.init({ 
    duration: 700, 
    easing: 'ease-out-cubic', 
    once: true, 
    offset: 80 
});

// ===== NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTING =====
const navbar = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', function() {
    // Navbar scroll effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Active link highlighting
    var current = '';
    sections.forEach(function(section) {
        var sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
    
    // Back to top button visibility
    var backToTop = document.getElementById('backToTop');
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// ===== BACK TO TOP BUTTON =====
document.getElementById('backToTop').addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SKILL BAR ANIMATION WITH INTERSECTION OBSERVER =====
var skillObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            var bars = entry.target.querySelectorAll('.skill-bar-fill');
            bars.forEach(function(bar) {
                var w = bar.getAttribute('data-width');
                setTimeout(function() { bar.style.width = w + '%'; }, 200);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-card').forEach(function(card) {
    skillObserver.observe(card);
});

// ===== CONTACT FORM HANDLING =====
function handleFormSubmit(event) {
    event.preventDefault();
    var name = sanitizeInput(document.getElementById('contactName').value.trim());
    var email = sanitizeInput(document.getElementById('contactEmail').value.trim());
    var subject = sanitizeInput(document.getElementById('contactSubject').value.trim());
    var message = sanitizeInput(document.getElementById('contactMessage').value.trim());
    
    if (!name || !email || !subject || !message) return;
    
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return;

    var submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Mengirim...';

    setTimeout(function() {
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
        setTimeout(function() {
            document.getElementById('contactForm').style.display = 'block';
            document.getElementById('formSuccess').style.display = 'none';
            document.getElementById('contactForm').reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send"></i> Kirim Pesan';
        }, 3000);
    }, 1500);
}

// ===== THEME TOGGLE =====
var isDark = true;
document.getElementById('themeToggle').addEventListener('click', function() {
    isDark = !isDark;
    this.querySelector('i').className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
});

// ===== CLOSE MOBILE MENU ON LINK CLICK =====
document.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function() {
        var navCollapse = document.getElementById('navbarNav');
        var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
    });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== PARTICLES CANVAS ANIMATION =====
var canvas = document.getElementById('particles-canvas');
var ctx = canvas.getContext('2d');
var pts = [];

function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
}

function createPts() {
    pts = [];
    var count = Math.min(50, Math.floor(canvas.width * canvas.height / 18000));
    for (var i = 0; i < count; i++) {
        pts.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.3 + 0.1
        });
    }
}

function drawPts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, ' + p.opacity + ')';
        ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
            var p2 = pts[j];
            var dx = p.x - p2.x;
            var dy = p.y - p2.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = 'rgba(16, 185, 129, ' + (0.06 * (1 - dist / 120)) + ')';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawPts);
}

// Initialize particles
resizeCanvas();
createPts();
drawPts();
window.addEventListener('resize', function() { resizeCanvas(); createPts(); });

// ===== CURSOR TRAIL PARTICLES =====
document.addEventListener('mousemove', function(e) {
    // Create cursor trail particle
    var particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.left = e.clientX + 'px';
    particle.style.top = e.clientY + 'px';
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(function() {
        particle.remove();
    }, 600);
    
    // Interactive background shapes parallax effect
    var shapes = document.querySelectorAll('.bg-shape');
    shapes.forEach(function(shape, index) {
        var speed = (index + 1) * 0.02;
        var xOffset = (e.clientX - window.innerWidth / 2) * speed;
        var yOffset = (e.clientY - window.innerHeight / 2) * speed;
        shape.style.transform = 'translate(' + xOffset + 'px, ' + yOffset + 'px)';
    });
});

// ===== CARD POP EFFECT ON HOVER =====
document.querySelectorAll('.skill-card, .experience-card, .cert-card, .highlight-item, .tool-badge, .edu-card, .project-card').forEach(function(card) {
    card.addEventListener('mouseenter', function() {
        // Add subtle glow effect
        this.style.boxShadow = this.style.boxShadow.replace(/rgba\([^)]+\)/g, function(match) {
            return match.replace(/[\d.]+/g, function(num) {
                return Math.min(parseFloat(num) + 0.1, 1).toFixed(2);
            });
        });
    });
    
    card.addEventListener('mouseleave', function() {
        // Reset glow effect
    });
});

// ===== INTERACTIVE FLOATING ORBS IN HERO =====
var heroSection = document.getElementById('hero');
if (heroSection) {
    heroSection.addEventListener('mousemove', function(e) {
        var orbs = this.querySelectorAll('.floating-orb');
        orbs.forEach(function(orb, index) {
            var speed = (index + 1) * 0.03;
            var rect = heroSection.getBoundingClientRect();
            var x = (e.clientX - rect.left - rect.width / 2) * speed;
            var y = (e.clientY - rect.top - rect.height / 2) * speed;
            orb.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        });
    });
    
    heroSection.addEventListener('mouseleave', function() {
        var orbs = this.querySelectorAll('.floating-orb');
        orbs.forEach(function(orb) {
            orb.style.transform = 'translate(0, 0)';
        });
    });
}
