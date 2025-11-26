(() => {
  const panel = document.getElementById("selection-panel");
  const avatarImages = document.getElementById("avatar-images");

  const calculateBtn = document.getElementById("calculate-btn");
  const resultModal = document.getElementById("result-modal");
  const resultCard = document.getElementById("result-card");
  const resultTitle = document.getElementById("result-title");
  const resultMessage = document.getElementById("result-message");
  const resultBadge = document.getElementById("result-badge");
  const postActions = document.getElementById("post-actions");
  const resetBtn = document.getElementById("reset-btn");
  const infoLinkBtn = document.querySelector(".btn.info-link");

  // Tutorial modal
  const tutorialModal = document.getElementById("tutorial-modal");
  const startGameBtn = document.getElementById("start-game-btn");

  const LIMIT = 60000;
  const currency = new Intl.NumberFormat("ko-KR");

  const labels = {
    tops: "TOPS",
    bottoms: "BOTTOMS",
    accessories: "ACCESSORIES",
  };

  const state = {
    tops: null,
    bottoms: null,
    accessories: null,
  };

  function getImageFileName(category, index) {
    const categoryPrefix = {
      tops: "top",
      bottoms: "bottom",
      accessories: "acc",
    };
    const prefix = categoryPrefix[category] || category;
    return `${prefix}_${index + 1}.png`;
  }

  function playHoverSound() {
    const audio = new Audio("https://taira-komori.net/sound_os2/game01/select06.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => {
      // 오디오 재생 실패 시 무시 (사용자 상호작용 필요 등)
      console.log("Audio play failed:", err);
    });
  }

  function playCalculateSound() {
    const audio = new Audio("https://taira-komori.net/sound_os2/game01/coin07.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => {
      // 오디오 재생 실패 시 무시 (사용자 상호작용 필요 등)
      console.log("Audio play failed:", err);
    });
  }

  function playPickupSound() {
    const audio = new Audio("https://taira-komori.net/sound_os2/game01/pickup03.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => {
      // 오디오 재생 실패 시 무시 (사용자 상호작용 필요 등)
      console.log("Audio play failed:", err);
    });
  }

  function playButtonHoverSound() {
    const audio = new Audio("https://taira-komori.net/sound_os2/game01/select05.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => {
      // 오디오 재생 실패 시 무시 (사용자 상호작용 필요 등)
      console.log("Audio play failed:", err);
    });
  }

  function playButtonClickSound() {
    const audio = new Audio("https://taira-komori.net/sound_os2/game01/poka03.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => {
      // 오디오 재생 실패 시 무시 (사용자 상호작용 필요 등)
      console.log("Audio play failed:", err);
    });
  }

  function buildButtons(category, items) {
    const section = document.createElement("section");
    const title = document.createElement("h2");
    title.textContent = labels[category];
    section.appendChild(title);

    const buttons = document.createElement("div");
    buttons.className = "item-buttons";

    items.forEach((item, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.category = category;
      btn.dataset.itemId = item.id;
      
      // 이미지 요소 생성
      const img = document.createElement("img");
      img.src = getImageFileName(category, index);
      img.alt = item.label;
      img.className = "item-image";
      btn.appendChild(img);
      
      btn.addEventListener("click", () => selectItem(category, item, btn));
      btn.addEventListener("mouseenter", playHoverSound);
      buttons.appendChild(btn);
    });

    section.appendChild(buttons);
    panel.appendChild(section);
  }

  function getItemIndex(category, itemId) {
    if (!window.DRESS_UP_ITEMS || !window.DRESS_UP_ITEMS[category]) return -1;
    return window.DRESS_UP_ITEMS[category].findIndex((item) => item.id === itemId);
  }

  function updateAvatar() {
    if (!avatarImages) return;

    // 기존 이미지 제거
    avatarImages.innerHTML = "";

    // 선택된 아이템들의 이미지 표시 (accessories가 제일 위에 오도록)
    const displayOrder = ["accessories", "tops", "bottoms"];
    
    displayOrder.forEach((category) => {
      const item = state[category];
      if (item) {
        const index = getItemIndex(category, item.id);
        if (index >= 0) {
          const img = document.createElement("img");
          img.src = getImageFileName(category, index);
          img.alt = item.label;
          img.className = "avatar-display-image";
          img.dataset.category = category;
          avatarImages.appendChild(img);
        }
      }
    });
  }

  function selectItem(category, item, btn) {
    if (tutorialModal && !tutorialModal.classList.contains("hidden")) {
      return; // 팝업이 열려있으면 선택 불가
    }
    playPickupSound();
    state[category] = item;
    updateActiveButtons(category, btn);
    updateAvatar();
    updateCalculateState();
  }

  function updateActiveButtons(category, activeButton) {
    const buttons = panel.querySelectorAll(`button[data-category="${category}"]`);
    buttons.forEach((button) => {
      button.classList.toggle("active", button === activeButton);
    });
  }

  function updateCalculateState() {
    if (!calculateBtn) return;
    const ready = Object.values(state).every(Boolean);
    calculateBtn.disabled = !ready;
  }

  function handleCalculate() {
    if (!Object.values(state).every(Boolean)) return;

    playCalculateSound();

    const total =
      state.tops.price + state.bottoms.price + state.accessories.price;
    const success = total <= LIMIT;

    resultBadge.className = `badge ${success ? "success" : "fail"}`;
    resultBadge.textContent = success ? "성공" : "실패";
    resultTitle.textContent = `총 ${currency.format(total)}원`;
    resultMessage.textContent = success
      ? "6만원 이하로 코디에 성공했어요!"
      : "빈티지인 척 하는 새 옷이 섞여있었나봐요. 다시 골라볼까요?";

    calculateBtn.disabled = true;

    if (resultModal) {
      resultModal.classList.add("active");
      document.body.classList.add("modal-open");
    }
  }

  function resetGame() {
    playButtonClickSound();
    Object.keys(state).forEach((key) => {
      state[key] = null;
    });

    panel.querySelectorAll("button.active").forEach((btn) => {
      btn.classList.remove("active");
    });

    updateAvatar();

    calculateBtn.disabled = true;

    if (resultModal) {
      resultModal.classList.remove("active");
      document.body.classList.remove("modal-open");
    }
  }

  function closeTutorial() {
    if (!tutorialModal) return;
    playButtonClickSound();
    tutorialModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
    // 게임 버튼들 활성화
    panel.querySelectorAll("button").forEach((btn) => {
      btn.disabled = false;
      btn.style.pointerEvents = "";
      btn.style.opacity = "";
    });
  }

  function disableGameButtons() {
    // 팝업이 열려있을 때 게임 버튼들 비활성화
    panel.querySelectorAll("button").forEach((btn) => {
      btn.disabled = true;
      btn.style.pointerEvents = "none";
      btn.style.opacity = "0.5";
    });
  }

  function init() {
    if (!window.DRESS_UP_ITEMS) return;
    window.DRESS_UP_ORDER.forEach((category) => {
      buildButtons(category, window.DRESS_UP_ITEMS[category]);
    });

    calculateBtn?.addEventListener("click", handleCalculate);
    resetBtn?.addEventListener("click", resetGame);

    // 버튼 호버 소리 추가
    startGameBtn?.addEventListener("mouseenter", playButtonHoverSound);
    resetBtn?.addEventListener("mouseenter", playButtonHoverSound);
    infoLinkBtn?.addEventListener("mouseenter", playButtonHoverSound);

    // 버튼 클릭 소리 추가
    infoLinkBtn?.addEventListener("click", playButtonClickSound);

    // 팝업 관련 이벤트
    if (tutorialModal) {
      document.body.classList.add("modal-open");
      disableGameButtons();

      startGameBtn?.addEventListener("click", closeTutorial);

      // 모달 오버레이 클릭 시 닫기 (모달 콘텐츠 클릭은 제외)
      tutorialModal.addEventListener("click", (e) => {
        if (e.target === tutorialModal) {
          closeTutorial();
        }
      });
    }
  }

  init();
})();
