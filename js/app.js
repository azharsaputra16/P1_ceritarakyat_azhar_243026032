(function () {
  "use strict";

  var SLIDES = [
    {
      image: "img/1.jpg",
      chapter: "Adegan 1",
      heading: "Doa Mbak Srini",
      text: "Di sebuah desa terpencil, Mbak Srini, seorang janda tua yang hidup sebatang kara dan kesepian, bersujud memanjatkan doa tulus di teras rumahnya agar dikaruniai seorang anak."
    },
    {
      image: "img/2.jpg",
      chapter: "Adegan 2",
      heading: "Munculnya Buto Ijo",
      text: "Tiba-tiba tanah bergetar dan muncul raksasa hijau menakutkan bernama Buto Ijo. Mendengar doa tersebut, Buto Ijo menawarkan sebutir benih ajaib dengan syarat kelak jika anak itu dewasa harus diserahkan kepadanya."
    },
    {
      image: "img/3.jpg",
      chapter: "Adegan 3",
      heading: "Mentimun Emas",
      text: "Mbak Srini menanam benih tersebut dengan penuh kasih sayang di kebunnya hingga tumbuh tanaman merambat dengan sebuah mentimun raksasa berwarna kuning keemasan yang bersinar terang."
    },
    {
      image: "img/4.jpg",
      chapter: "Adegan 4",
      heading: "Kelahiran Timun Mas",
      text: "Saat mentimun emas itu dipetik dan dibelah dengan hati-hati, Mbak Srini terkejut sekaligus bahagia mendapati seorang bayi perempuan mungil yang cantik di dalamnya, yang kemudian ia beri nama Timun Mas."
    },
    {
      image: "img/5.jpg",
      chapter: "Adegan 5",
      heading: "Timun Mas Tumbuh Dewasa",
      text: "Waktu berlalu cepat, Timun Mas tumbuh menjadi gadis remaja yang anggun, berbakti, dan penuh senyuman, membuat hari-hari Mbak Srini dipenuhi kebahagiaan."
    },
    {
      image: "img/6.jpg",
      chapter: "Adegan 6",
      heading: "Empat Kantong Ajaib",
      text: "Menjelang hari penagihan janji Buto Ijo, Mbak Srini memberikan empat kantong ajaib berisi biji mentimun, jarum, garam, dan terasi kepada Timun Mas sebagai bekal perlindungan diri."
    },
    {
      image: "img/7.jpg",
      chapter: "Adegan 7",
      heading: "Timun Mas Mulai Berlari",
      text: "Suara langkah berat Buto Ijo terdengar mendekat. Dengan derai air mata dan doa restu, Mbak Srini memeluk Timun Mas erat-erat sebelum menyuruhnya berlari kencang menyelamatkan diri."
    },
    {
      image: "img/8.jpg",
      chapter: "Adegan 8",
      heading: "Kejar-kejaran di Hutan",
      text: "Buto Ijo mengejar Timun Mas ke dalam hutan lebat dengan langkah raksasanya yang menghancurkan pepohonan, sementara Timun Mas berlari sekuat tenaga sambil memegang kantong ajaibnya."
    },
    {
      image: "img/9.jpg",
      chapter: "Adegan 9",
      heading: "Rintangan Ajaib",
      text: "Terdesak oleh kejaran sang raksasa, Timun Mas melemparkan isi kantongnya; taburan biji berubah menjadi ladang duri lebat dan rintangan cabai pedas yang membakar serta melilit tubuh Buto Ijo."
    },
    {
      image: "img/10.jpg",
      chapter: "Adegan 10",
      heading: "Buto Ijo Tenggelam",
      text: "Terakhir, Timun Mas melemparkan kantong berisi terasi yang seketika mengubah tanah menjadi lautan lumpur mendidih. Buto Ijo pun tenggelam ke dalamnya, mengakhiri ancaman selamanya, dan Timun Mas bisa kembali pulang berkumpul bersama Mbak Srini dengan damai."
    }
  ];

  var els = {
    image: document.getElementById("storyImage"),
    chapter: document.getElementById("storyChapter"),
    heading: document.getElementById("storyHeading"),
    text: document.getElementById("storyText"),
    counter: document.getElementById("pageCurrent"),
    prev: document.getElementById("prevBtn"),
    next: document.getElementById("nextBtn"),
    dots: document.getElementById("navDots"),
    endnote: document.getElementById("endnote"),
    story: document.getElementById("story"),

    readBtn: document.getElementById("readBtn"),
    readBtnText: document.querySelector(".read-btn__text"),
    readBtnIcon: document.querySelector(".read-btn__icon"),

    bgMusic: document.getElementById("bgMusic")
  };

  var TOTAL = SLIDES.length;
  var currentIndex = 0;

  var SWIPE_THRESHOLD = 50;

  /* =====================================================
     BACKSOUND
     ===================================================== */

  var musicStarted = false;

  function startMusic() {
    if (!els.bgMusic) {
      return;
    }

    if (musicStarted) {
      return;
    }

    /*
      Volume backsound:
      0.05 = 20%
    */
    els.bgMusic.loop = true;
    els.bgMusic.volume = 0.01;

    var playPromise = els.bgMusic.play();

    if (playPromise !== undefined) {
      playPromise
        .then(function () {
          musicStarted = true;
        })
        .catch(function () {
          /*
            Browser bisa memblokir autoplay.
            Musik akan mencoba berjalan lagi
            setelah user melakukan interaksi.
          */
        });
    }
  }

  function tryStartMusic() {
    if (!els.bgMusic) {
      return;
    }

    if (!musicStarted) {
      startMusic();
    }
  }

  /*
    Coba jalankan musik ketika user
    melakukan interaksi pertama.
  */

  document.addEventListener(
    "click",
    tryStartMusic,
    {
      once: false
    }
  );

  document.addEventListener(
    "touchstart",
    tryStartMusic,
    {
      once: false,
      passive: true
    }
  );

  document.addEventListener(
    "keydown",
    tryStartMusic,
    {
      once: false
    }
  );

  /*
    Jika lagu sampai selesai,
    mulai lagi dari awal.
  */

  els.bgMusic.addEventListener(
    "ended",
    function () {
      els.bgMusic.currentTime = 0;

      els.bgMusic.play()
        .then(function () {
          musicStarted = true;
        })
        .catch(function () {});
    }
  );


  /* =====================================================
     TEXT TO SPEECH
     ===================================================== */

  var speech = window.speechSynthesis;
  var isReading = false;

  function setReadButtonNormal() {
    isReading = false;

    els.readBtn.classList.remove(
      "is-reading"
    );

    els.readBtnIcon.textContent = "🔊";

    els.readBtnText.textContent =
      "Bacakan";
  }

  function setReadButtonReading() {
    isReading = true;

    els.readBtn.classList.add(
      "is-reading"
    );

    els.readBtnIcon.textContent = "⏹";

    els.readBtnText.textContent =
      "Berhenti";
  }

  function stopReading() {
    if (
      speech &&
      speech.speaking
    ) {
      speech.cancel();
    }

    setReadButtonNormal();
  }

  function readStory() {
    if (
      !("speechSynthesis" in window)
    ) {
      alert(
        "Browser kamu tidak mendukung fitur bacakan cerita."
      );

      return;
    }

    /*
      Kalau sedang membaca,
      tombol berfungsi untuk berhenti.
    */

    if (isReading) {
      stopReading();

      return;
    }

    var text =
      els.text.textContent;

    if (
      !text ||
      !text.trim()
    ) {
      return;
    }

    speech.cancel();

    var utterance =
      new SpeechSynthesisUtterance(
        text
      );

    /*
      Bahasa Indonesia
    */
    utterance.lang = "id-ID";

    /*
      Kecepatan suara.
      0.85 dibuat sedikit lebih pelan
      supaya kata-kata lebih jelas.
    */
    utterance.rate = 0.85;

    /*
      Nada suara normal.
    */
    utterance.pitch = 1;

    /*
      Volume suara maksimal.
      1.0 = 100%
    */
    utterance.volume = 10.0;

    utterance.onstart =
      function () {
        setReadButtonReading();
      };

    utterance.onend =
      function () {
        setReadButtonNormal();
      };

    utterance.onerror =
      function () {
        setReadButtonNormal();
      };

    speech.speak(
      utterance
    );
  }

  els.readBtn.addEventListener(
    "click",
    readStory
  );


  /* =====================================================
     DOT NAVIGATION
     ===================================================== */

  function buildDots() {
    var fragment =
      document.createDocumentFragment();

    SLIDES.forEach(
      function (
        slide,
        index
      ) {
        var dot =
          document.createElement(
            "button"
          );

        dot.type = "button";

        dot.className =
          "nav__dot";

        dot.setAttribute(
          "role",
          "tab"
        );

        dot.setAttribute(
          "aria-label",
          "Ke halaman " +
            (index + 1)
        );

        dot.dataset.index =
          String(index);

        fragment.appendChild(
          dot
        );
      }
    );

    els.dots.appendChild(
      fragment
    );
  }

  function updateDots() {
    var dots =
      els.dots.children;

    for (
      var i = 0;
      i < dots.length;
      i++
    ) {
      var isActive =
        i === currentIndex;

      dots[i].classList.toggle(
        "is-active",
        isActive
      );

      dots[i].setAttribute(
        "aria-selected",
        isActive
          ? "true"
          : "false"
      );

      dots[i].tabIndex =
        isActive
          ? 0
          : -1;
    }
  }


  /* =====================================================
     IMAGE PRELOAD
     ===================================================== */

  function preload(index) {
    if (
      index < 0 ||
      index >= TOTAL
    ) {
      return;
    }

    var img =
      new Image();

    img.src =
      SLIDES[index].image;
  }


  /* =====================================================
     RENDER CERITA
     ===================================================== */

  function render() {
    var slide =
      SLIDES[currentIndex];

    /*
      Hentikan pembacaan
      ketika pindah halaman.
    */

    stopReading();

    /*
      Animasi gambar.
    */

    els.image.classList.add(
      "is-loading"
    );

    els.image.onload =
      function () {
        els.image.classList.remove(
          "is-loading"
        );
      };

    els.image.src =
      slide.image;

    els.image.alt =
      slide.heading;

    if (
      els.image.complete
    ) {
      els.image.classList.remove(
        "is-loading"
      );
    }

    /*
      Isi cerita.
    */

    els.chapter.textContent =
      slide.chapter;

    els.heading.textContent =
      slide.heading;

    els.text.textContent =
      slide.text;

    /*
      Counter halaman.
    */

    els.counter.textContent =
      String(
        currentIndex + 1
      );

    /*
      Tombol sebelumnya.
    */

    var isFirst =
      currentIndex === 0;

    /*
      Tombol berikutnya.
    */

    var isLast =
      currentIndex ===
      TOTAL - 1;

    els.prev.disabled =
      isFirst;

    els.next.disabled =
      isLast;

    els.next.setAttribute(
      "aria-disabled",
      String(isLast)
    );

    /*
      Pesan tamat.
    */

    els.endnote.hidden =
      !isLast;

    /*
      Update titik halaman.
    */

    updateDots();

    /*
      Preload gambar
      berikutnya dan sebelumnya.
    */

    preload(
      currentIndex + 1
    );

    preload(
      currentIndex - 1
    );
  }


  /* =====================================================
     NAVIGASI
     ===================================================== */

  function goTo(index) {
    if (
      index < 0 ||
      index >= TOTAL ||
      index === currentIndex
    ) {
      return;
    }

    currentIndex = index;

    render();
  }

  function step(delta) {
    goTo(
      currentIndex + delta
    );
  }

  /*
    Tombol sebelumnya.
  */

  els.prev.addEventListener(
    "click",
    function () {
      step(-1);
    }
  );

  /*
    Tombol berikutnya.
  */

  els.next.addEventListener(
    "click",
    function () {
      step(1);
    }
  );


  /* =====================================================
     KLIK DOT
     ===================================================== */

  els.dots.addEventListener(
    "click",
    function (event) {
      var dot =
        event.target.closest(
          ".nav__dot"
        );

      if (
        !dot ||
        !els.dots.contains(dot)
      ) {
        return;
      }

      goTo(
        Number(
          dot.dataset.index
        )
      );
    }
  );


  /* =====================================================
     KEYBOARD
     ===================================================== */

  document.addEventListener(
    "keydown",
    function (event) {
      if (
        event.key ===
        "ArrowRight"
      ) {
        step(1);
      }

      else if (
        event.key ===
        "ArrowLeft"
      ) {
        step(-1);
      }
    }
  );


  /* =====================================================
     SWIPE MOBILE
     ===================================================== */

  var touchStartX = 0;
  var touchStartY = 0;

  els.story.addEventListener(
    "touchstart",
    function (event) {
      touchStartX =
        event.touches[0].clientX;

      touchStartY =
        event.touches[0].clientY;
    },
    {
      passive: true
    }
  );

  els.story.addEventListener(
    "touchend",
    function (event) {
      var deltaX =
        event.changedTouches[0]
          .clientX -
        touchStartX;

      var deltaY =
        event.changedTouches[0]
          .clientY -
        touchStartY;

      /*
        Pastikan gerakan lebih dominan
        horizontal daripada vertikal.
      */

      if (
        Math.abs(deltaX) >
          SWIPE_THRESHOLD &&
        Math.abs(deltaX) >
          Math.abs(deltaY)
      ) {
        step(
          deltaX < 0
            ? 1
            : -1
        );
      }
    },
    {
      passive: true
    }
  );


  /* =====================================================
     MULAI
     ===================================================== */

  buildDots();

  render();

})();