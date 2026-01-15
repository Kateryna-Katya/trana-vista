document.addEventListener('DOMContentLoaded', () => {

  /* === 1. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ === */
  const header = document.querySelector('.header');
  const burger = document.querySelector('.burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const cookiePopup = document.getElementById('cookie-popup');
  const cookieAccept = document.getElementById('cookie-accept');

  /* === 2. УМНАЯ АНИМАЦИЯ ТЕКСТА (БЕЗ РАЗРЫВА ТЕГОВ И СЛОВ) === */
  const initHeroAnimation = () => {
      const title = document.querySelector('.js-split-text');
      if (!title) return;

      // Функция для обработки узлов (сохраняет <span>, разбивает текст)
      const processNode = (node) => {
          const nodes = Array.from(node.childNodes);
          node.innerHTML = '';

          nodes.forEach(child => {
              if (child.nodeType === Node.TEXT_NODE) {
                  // Разбиваем текст на слова, чтобы они не разрывались при переносе
                  const words = child.textContent.split(/(\s+)/);
                  words.forEach(word => {
                      if (word.trim().length > 0) {
                          const wordSpan = document.createElement('span');
                          wordSpan.className = 'word';

                          // Разбиваем слово на буквы
                          word.split('').forEach(char => {
                              const charSpan = document.createElement('span');
                              charSpan.className = 'split-char';
                              charSpan.textContent = char;
                              wordSpan.appendChild(charSpan);
                          });
                          node.appendChild(wordSpan);
                      } else {
                          // Сохраняем пробелы
                          node.appendChild(document.createTextNode(word));
                      }
                  });
              } else if (child.nodeType === Node.ELEMENT_NODE) {
                  // Если это тег (например, span.text-highlight), обрабатываем его рекурсивно
                  const clone = child.cloneNode(false);
                  processNode(child);
                  clone.innerHTML = child.innerHTML;
                  node.appendChild(clone);
              }
          });
      };

      processNode(title);

      // Запуск появления букв
      const allChars = title.querySelectorAll('.split-char');
      allChars.forEach((char, i) => {
          setTimeout(() => {
              char.classList.add('visible');
          }, i * 35);
      });
  };

  /* === 3. МОБИЛЬНОЕ МЕНЮ === */
  const toggleMenu = () => {
      burger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
  };

  if (burger) {
      burger.addEventListener('click', toggleMenu);
  }

  // Закрытие при клике на ссылку
  document.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => {
          if (mobileMenu.classList.contains('active')) toggleMenu();
      });
  });

  /* === 4. ОБЩИЕ АНИМАЦИИ ПРИ СКРОЛЛЕ (Intersection Observer) === */
  const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              // Если внутри есть счетчик, запускаем его
              if (entry.target.classList.contains('benefit-item')) {
                  const valueEl = entry.target.querySelector('.benefit-item__value');
                  if (valueEl) startCounter(valueEl);
              }
              scrollObserver.unobserve(entry.target);
          }
      });
  }, { threshold: 0.15 });

  document.querySelectorAll('.animate-item').forEach(el => scrollObserver.observe(el));

  /* === 5. СЧЕТЧИКИ В BENEFITS === */
  const startCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'));
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / target));
      let current = 0;

      const timer = setInterval(() => {
          current += 1;
          el.childNodes[0].textContent = current;
          if (current === target) clearInterval(timer);
      }, stepTime);
  };

  /* === 6. COOKIE POPUP === */
  if (!localStorage.getItem('trana_cookies_accepted')) {
      setTimeout(() => cookiePopup.classList.add('active'), 3000);
  }

  if (cookieAccept) {
      cookieAccept.addEventListener('click', () => {
          localStorage.setItem('trana_cookies_accepted', 'true');
          cookiePopup.classList.remove('active');
      });
  }

  /* === 7. HEADER SCROLL ЭФФЕКТ === */
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          header.classList.add('header--scrolled');
      } else {
          header.classList.remove('header--scrolled');
      }
  });

  /* === 8. ФОРМА КОНТАКТОВ: ВАЛИДАЦИЯ И КАПЧА === */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
      const mathProblem = document.getElementById('math-problem');
      const phoneInput = document.getElementById('phone');
      let captchaResult = 0;

      // Только цифры в телефоне
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/[^0-9]/g, '');
      });

      const generateCaptcha = () => {
          const a = Math.floor(Math.random() * 10) + 1;
          const b = Math.floor(Math.random() * 10) + 1;
          captchaResult = a + b;
          mathProblem.textContent = `${a} + ${b} = ?`;
      };
      generateCaptcha();

      contactForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const userCaptcha = document.getElementById('captcha').value;
          const formMsg = document.getElementById('form-message');
          const btn = document.getElementById('submit-btn');

          if (parseInt(userCaptcha) !== captchaResult) {
              formMsg.textContent = "Неверный ответ капчи!";
              formMsg.className = "form__message form__message--error";
              generateCaptcha();
              return;
          }

          // Имитация AJAX
          btn.innerHTML = '<div class="loader" style="display:block; margin: 0 auto;"></div>';
          btn.disabled = true;

          await new Promise(resolve => setTimeout(resolve, 1500));

          formMsg.textContent = "Сообщение отправлено! Мы свяжемся с вами.";
          formMsg.className = "form__message form__message--success";
          contactForm.reset();
          btn.innerHTML = 'Начать сейчас';
          btn.disabled = false;
          generateCaptcha();
      });
  }

  // Запуск анимации Hero
  initHeroAnimation();
});