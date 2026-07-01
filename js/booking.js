/**
 * MARULA. — booking widget
 * Fully client-side demo booking flow. No backend, no persistence —
 * matches the brief's "functional demo booking experience" requirement.
 *
 * Replace WHATSAPP_NUMBER with the real demo number before submission.
 */
(() => {
  const WHATSAPP_NUMBER = "27600000000"; // demo number — replace with yours
  const CLOSED_WEEKDAYS = [1]; // 0=Sun, 1=Mon ... 6=Sat — Monday is the day off
  const OPEN_HOUR = 8;
  const CLOSE_HOUR = 17;
  const SLOT_MINUTES = 45;
  const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTH_LABELS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const state = {
    viewMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    selectedDate: null, // Date
    selectedSlot: null, // "HH:MM" string
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    els.monthLabel = document.getElementById("calendarMonthLabel");
    els.grid = document.getElementById("calendarGrid");
    els.prevBtn = document.getElementById("calendarPrev");
    els.nextBtn = document.getElementById("calendarNext");
    els.slotsWrap = document.getElementById("slotsWrap");
    els.slotsGrid = document.getElementById("slotsGrid");
    els.slotsEmpty = document.getElementById("slotsEmpty");
    els.form = document.getElementById("bookingForm");
    els.summary = document.getElementById("bookingSummary");
    els.confirmation = document.getElementById("bookingConfirmation");
    els.confirmationSummary = document.getElementById("confirmationSummary");
    els.whatsappLink = document.getElementById("whatsappLink");
    els.resetBtn = document.getElementById("resetBooking");
    els.liveRegion = document.getElementById("bookingLive");

    if (!els.grid) return; // not on the booking page

    els.prevBtn.addEventListener("click", () => changeMonth(-1));
    els.nextBtn.addEventListener("click", () => changeMonth(1));
    els.form.addEventListener("submit", handleSubmit);
    els.resetBtn.addEventListener("click", resetBooking);

    // Live-validate on blur so errors don't only appear on submit.
    els.form.querySelectorAll("input, select").forEach((field) => {
      field.addEventListener("blur", () => {
        field.dataset.touched = "true";
        validateField(field);
      });
    });

    renderCalendar();
    renderSlots();
    updateSummary();
  }

  function changeMonth(delta) {
    state.viewMonth = new Date(
      state.viewMonth.getFullYear(),
      state.viewMonth.getMonth() + delta,
      1
    );
    renderCalendar();
  }

  function isSameDay(a, b) {
    return a && b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function renderCalendar() {
    const year = state.viewMonth.getFullYear();
    const month = state.viewMonth.getMonth();
    els.monthLabel.textContent = `${MONTH_LABELS[month]} ${year}`;

    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = startOfToday();

    els.grid.innerHTML = "";

    DOW_LABELS.forEach((label) => {
      const cell = document.createElement("div");
      cell.className = "calendar__dow";
      cell.textContent = label;
      els.grid.appendChild(cell);
    });

    for (let i = 0; i < firstDow; i++) {
      const empty = document.createElement("div");
      empty.className = "calendar__day calendar__day--empty";
      els.grid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "calendar__day";
      btn.textContent = String(day);

      const isPast = date < today;
      const isClosed = CLOSED_WEEKDAYS.includes(date.getDay());
      const isDisabled = isPast || isClosed;

      btn.disabled = isDisabled;
      btn.setAttribute(
        "aria-label",
        `${date.toDateString()}${isClosed ? ", closed" : isPast ? ", past date" : ""}`
      );
      btn.setAttribute("aria-pressed", isSameDay(date, state.selectedDate) ? "true" : "false");

      if (!isDisabled) {
        btn.addEventListener("click", () => selectDate(date));
      }

      els.grid.appendChild(btn);
    }
  }

  function selectDate(date) {
    state.selectedDate = date;
    state.selectedSlot = null;
    renderCalendar();
    renderSlots();
    updateSummary();
    announce(`${date.toDateString()} selected. Choose a time.`);
  }

  function formatTime(hour, minute) {
    const h = String(hour).padStart(2, "0");
    const m = String(minute).padStart(2, "0");
    return `${h}:${m}`;
  }

  function renderSlots() {
    els.slotsGrid.innerHTML = "";

    if (!state.selectedDate) {
      els.slotsEmpty.classList.remove("hidden");
      els.slotsGrid.classList.add("hidden");
      return;
    }

    els.slotsEmpty.classList.add("hidden");
    els.slotsGrid.classList.remove("hidden");

    const now = new Date();
    const isToday = isSameDay(state.selectedDate, now);

    let hour = OPEN_HOUR;
    let minute = 0;

    while (hour < CLOSE_HOUR || (hour === CLOSE_HOUR && minute === 0)) {
      if (hour === CLOSE_HOUR && minute > 0) break;

      const label = formatTime(hour, minute);
      const slotDate = new Date(state.selectedDate);
      slotDate.setHours(hour, minute, 0, 0);

      const isPastToday = isToday && slotDate < now;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot-btn";
      btn.textContent = label;
      btn.disabled = isPastToday;
      btn.setAttribute("aria-pressed", state.selectedSlot === label ? "true" : "false");

      if (!isPastToday) {
        btn.addEventListener("click", () => selectSlot(label));
      }

      els.slotsGrid.appendChild(btn);

      minute += SLOT_MINUTES;
      if (minute >= 60) {
        hour += Math.floor(minute / 60);
        minute = minute % 60;
      }
    }
  }

  function selectSlot(label) {
    state.selectedSlot = label;
    document.querySelectorAll(".slot-btn").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.textContent === label ? "true" : "false");
    });
    updateSummary();
    announce(`${label} selected.`);
  }

  function updateSummary() {
    if (!els.summary) return;
    if (state.selectedDate && state.selectedSlot) {
      els.summary.innerHTML =
        `You're booking <strong>${state.selectedDate.toDateString()}</strong> at <strong>${state.selectedSlot}</strong>.`;
      els.summary.classList.remove("hidden");
    } else {
      els.summary.classList.add("hidden");
    }
  }

  function validateField(field) {
    const errorEl = document.getElementById(`${field.id}Error`);
    const valid = field.checkValidity();
    if (errorEl) {
      errorEl.classList.toggle("is-visible", !valid);
    }
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();

    let firstInvalid = null;
    let allValid = true;

    els.form.querySelectorAll("input[required], select[required]").forEach((field) => {
      field.dataset.touched = "true";
      const valid = validateField(field);
      if (!valid) {
        allValid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    const dateTimeError = document.getElementById("dateTimeError");
    if (!state.selectedDate || !state.selectedSlot) {
      allValid = false;
      dateTimeError.classList.add("is-visible");
      if (!firstInvalid) firstInvalid = els.grid;
    } else {
      dateTimeError.classList.remove("is-visible");
    }

    if (!allValid) {
      announce("Please fix the highlighted fields before booking.");
      if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
      return;
    }

    const name = document.getElementById("guestName").value.trim();
    const phone = document.getElementById("guestPhone").value.trim();
    const guests = document.getElementById("guestCount").value;

    showConfirmation({ name, phone, guests });
  }

  function showConfirmation({ name, phone, guests }) {
    const dateStr = state.selectedDate.toDateString();
    const timeStr = state.selectedSlot;

    els.form.closest(".booking-form").classList.add("hidden");
    els.confirmation.classList.remove("hidden");

    els.confirmationSummary.innerHTML = `
      <p><strong>${name}</strong>, table for ${guests}</p>
      <p>${dateStr} at ${timeStr}</p>
      <p>We've held your table — confirm on WhatsApp to lock it in.</p>
    `;

    const message =
      `Hello, I would like to book a table at MARULA. on ${dateStr} at ${timeStr} ` +
      `for ${guests} ${guests === "1" ? "guest" : "guests"}. Name: ${name}. Phone: ${phone}.`;

    els.whatsappLink.href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    announce("Booking confirmed. Message ready to send on WhatsApp.");
    els.confirmation.setAttribute("tabindex", "-1");
    els.confirmation.focus();
  }

  function resetBooking() {
    state.selectedDate = null;
    state.selectedSlot = null;
    els.form.reset();
    els.form.querySelectorAll(".field__error").forEach((el) => el.classList.remove("is-visible"));
    els.form.closest(".booking-form").classList.remove("hidden");
    els.confirmation.classList.add("hidden");
    renderCalendar();
    renderSlots();
    updateSummary();
    announce("Ready for a new booking.");
  }

  function announce(msg) {
    if (els.liveRegion) els.liveRegion.textContent = msg;
  }
})();
