import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';


const firebaseConfig = {
    apiKey: 'AIzaSyBSf6vvAMt_68U5nqaQCZMwmm8rPRZMkj4',
    authDomain: 'myanmar-3be37.firebaseapp.com',
    projectId: 'myanmar-3be37',
    storageBucket: 'myanmar-3be37.firebasestorage.app',
    messagingSenderId: '697234548667',
    appId: '1:697234548667:web:b7bd7966393ba0bb48c69e',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let promocodes = [];

let dateCampaniss = [
    { id: 1, activationDate: '2025-04-14', expirationDate: '2025-04-14', active: false },
    { id: 2, activationDate: '2025-04-15', expirationDate: '2025-04-15', active: false },
    { id: 3, activationDate: '2025-04-16', expirationDate: '2025-04-16', active: false },
    { id: 4, activationDate: '2025-04-17', expirationDate: '2025-04-17', active: false },
    { id: 5, activationDate: '2025-04-18', expirationDate: '2025-04-18', active: false },
    { id: 6, activationDate: '2025-04-19', expirationDate: '2025-04-19', active: false },
    { id: 7, activationDate: '2025-04-20', expirationDate: '2025-04-20', active: false },
    { id: 8, activationDate: '2025-04-21', expirationDate: '2025-04-21', active: false },
    { id: 9, activationDate: '2025-04-22', expirationDate: '2025-04-22', active: false },
    { id: 10, activationDate: '2025-04-23', expirationDate: '2025-04-23', active: false },
    { id: 11, activationDate: '2025-04-24', expirationDate: '2025-04-24', active: false },
    { id: 12, activationDate: '2025-04-25', expirationDate: '2025-04-25', active: false },
];

async function getPromocodes() {
  const docRef = doc(db, 'promo', 'yV68ciuqupEdgSuRlgca', '2', 'gAcigkdGZC2QQevT7ofA');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
      const data = docSnap.data();

      dateCampaniss.forEach((dayObj) => {
          const promosForDate = data[dayObj.activationDate];

          if (Array.isArray(promosForDate) && promosForDate.length > 0) {
              const randomPromo = promosForDate[Math.floor(Math.random() * promosForDate.length)];

              promocodes.push({
                  id: dayObj.id,
                  date: dayObj.activationDate,
                  promocode: randomPromo.promocode,
                  title: randomPromo.title,
                  active: true,
              });
          } else {
              promocodes.push({
                  id: dayObj.id,
                  date: dayObj.activationDate,
                  promocode: '',
                  title: 'No promo',
                  active: false,
              });
          }
      });
  } else {
      console.log('Нет такого документа!');
  }
}

async function init() {
  const date = new Date();
  const myanmarDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Yangon' }));
  const year = myanmarDate.getFullYear();
  const month = (myanmarDate.getMonth() + 1).toString().padStart(2, '0');
  const day = myanmarDate.getDate().toString().padStart(2, '0');
  const dateMyanma = `${year}-${month}-${day}`;
  console.log(`Дата в Мьянме: ${dateMyanma}`);

  await getPromocodes();


  dateCampaniss.forEach((dateObj) => {
      const dayElement = document.querySelector(`#${CSS.escape(dateObj.id)}`);
      if (dateObj.active) {
          dayElement.classList.add('active');
      } else {
      }
  });

  let clickedCard = null;

  const dayCards = document.querySelectorAll('.day');
  dayCards.forEach((card, index) => {
      card.addEventListener('click', () => {
          modal.style.display = 'flex';

          const promo = promocodes[index];
          if (promo) {
              document.querySelector('#datePromocode').textContent = promo.promocode || '-';
              document.querySelector('#titlePrize').textContent = promo.title || 'No promo';
          } else {
              console.log(`Нет данных для карточки с индексом ${index}`);
          }
      });
  });

  const closeBtn = document.getElementById('closeBtn');
  closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
      if (e.target === modal) {
          modal.style.display = 'none';
      }
  });
}

const copyIcon = document.querySelector('.icon-copy');
const promoTextElement = document.getElementById('datePromocode');
const notify = document.getElementById('copyNotify');

copyIcon.addEventListener('click', () => {
    const promoText = promoTextElement.textContent;

    if (promoText && promoText !== '-') {
        navigator.clipboard.writeText(promoText).then(() => {
            notify.style.display = 'block';

            setTimeout(() => {
                notify.style.display = 'none';
            }, 2000);
        }).catch((err) => {
            console.error('Ошибка при копировании:', err);
        });
    }
});

init();