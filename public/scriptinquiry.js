document.addEventListener('DOMContentLoaded', () => {
  const contactWrapper = document.querySelector('.contact-page-wrapper');
  if (!contactWrapper) return;

  // ----- hover glow inside contact area -----
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  contactWrapper.appendChild(glow);

  contactWrapper.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 900) return;
    const r = contactWrapper.getBoundingClientRect();
    glow.style.left = `${e.clientX - r.left}px`;
    glow.style.top = `${e.clientY - r.top}px`;
    glow.style.opacity = '1';
  });

  contactWrapper.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  // ----- inquiry / robot interaction -----
  const inquiryForm = document.getElementById('inquiryForm');
  const askMeLabel = document.getElementById('askMeLabel');
  const robotHead = document.getElementById('robotHead');
  const robotBubble = document.getElementById('robotBubble');
  const robotHand = document.getElementById('robotHand');
  const pupils = document.querySelectorAll('.pupil');
  const eyes = document.querySelectorAll('.eye');
  const formInputs = inquiryForm?.querySelectorAll('input, textarea, select') ?? [];

  let robotAwake = false;
  let isSmiling = false;
  let firstRobotClick = true;

  function createGlitter(x, y) {
    const glitter = document.createElement('div');
    glitter.className = 'glitter';
    glitter.style.left = `${x}px`;
    glitter.style.top = `${y + window.scrollY}px`;
    glitter.style.width = '14px';
    glitter.style.height = '4px';
    document.body.appendChild(glitter);
    setTimeout(() => glitter.remove(), 600);
  }

  function startBlinking() {
    function blink() {
      eyes.forEach(eye => eye.classList.add('blinking'));
      setTimeout(() => {
        eyes.forEach(eye => eye.classList.remove('blinking'));
      }, 120);
      setTimeout(blink, Math.random() * 3000 + 1500);
    }
    blink();
  }

  window.addEventListener('scroll', () => {
    if (!inquiryForm) return;
    const rForm = inquiryForm.getBoundingClientRect();
    const pForm = Math.min(1, Math.max(0, (window.innerHeight - rForm.top) / 600));

    if (rForm.top < window.innerHeight && !robotAwake) {
      robotAwake = true;
      startBlinking();
    }

    if (window.innerWidth > 900) {
      inquiryForm.style.transform = `translateY(${(1 - pForm) * 200}px) rotateX(${(1 - pForm) * 15}deg)`;
      inquiryForm.style.opacity = pForm;
      const scrollOffset = (window.innerHeight - rForm.top) * 0.15;
      askMeLabel.style.transform = `translateY(${scrollOffset * -0.5}px) rotateX(${scrollOffset * 0.1}deg)`;
    } else {
      inquiryForm.style.opacity = pForm;
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!robotAwake) return;
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;

    const contactRect = contactSection.getBoundingClientRect();
    const formRect = inquiryForm.getBoundingClientRect();
    const isInsideContact = e.clientY >= contactRect.top && e.clientY <= contactRect.bottom;
    const isInsideForm = e.clientX >= formRect.left && e.clientX <= formRect.right && e.clientY >= formRect.top && e.clientY <= formRect.bottom;
    if (isInsideContact && !isInsideForm) createGlitter(e.clientX, e.clientY);

    const rect = robotHead.getBoundingClientRect();
    const headCenterX = rect.left + rect.width / 2;
    const headCenterY = rect.top + rect.height / 2;
    const angleX = (e.clientY - headCenterY) / 12;
    const angleY = (e.clientX - headCenterX) / 12;
    const tiltX = Math.max(-12, Math.min(12, -angleX));
    const tiltY = Math.max(-15, Math.min(15, angleY));
    const curiousTilt = Math.abs(tiltY) > 8 ? (tiltY > 0 ? 5 : -5) : 0;
    robotHead.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${curiousTilt}deg)`;

    pupils.forEach(pupil => {
      const pRect = pupil.parentElement.getBoundingClientRect();
      const eyeCenterX = pRect.left + pRect.width / 2;
      const eyeCenterY = pRect.top + pRect.height / 2;
      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
      const distance = Math.min(pRect.width / 3.5, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 12);
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });

    if (isInsideForm) {
      robotHead.classList.add('smiling');
    } else if (!isSmiling) {
      robotHead.classList.remove('smiling');
    }
  });

  formInputs.forEach(input => {
    input.addEventListener('focus', () => { isSmiling = true; robotHead.classList.add('smiling'); });
    input.addEventListener('blur', () => { isSmiling = false; });
  });

  const robotQuotes = ["Start a project?", "Need help?", "Let's build!", "I'm listening."];
  robotHead.addEventListener('click', () => {
    let quote = "";
    if (firstRobotClick) {
      quote = "Hello!";
      firstRobotClick = false;
      robotHand.classList.add('waving');
    } else {
      quote = robotQuotes[Math.floor(Math.random() * robotQuotes.length)];
    }
    robotHead.classList.add('smiling');
    robotBubble.textContent = quote;
    robotBubble.classList.add('show');
    setTimeout(() => {
      robotBubble.classList.remove('show');
      robotHand.classList.remove('waving');
      if (!isSmiling) robotHead.classList.remove('smiling');
    }, 2500);
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === 'true') {
    const name = params.get('name');
    const ref = params.get('ref');
    const modal = document.getElementById('successModal');
    const message = document.getElementById('modalMessage');
    const closeBtn = document.getElementById('closeModal');
    const okBtn = document.getElementById('okButton');

    message.textContent = `Thank you, ${name}! Your inquiry was submitted successfully. Reference ID: ${ref}`;
    modal.style.display = 'block';

    closeBtn.onclick = () => modal.style.display = 'none';
    okBtn.onclick = () => modal.style.display = 'none';

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    }
  }
});
