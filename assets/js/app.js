(() => {
  const properties = window.PROPERTIES || [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const currencyFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  const initHeader = () => {
    const header = $("[data-header]");
    const navToggle = $("[data-nav-toggle]");
    const navMenu = $("[data-nav-menu]");

    if (header) {
      const updateHeader = () => {
        header.classList.toggle("scrolled", window.scrollY > 16);
      };
      updateHeader();
      window.addEventListener("scroll", updateHeader, { passive: true });
    }

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!isOpen));
        navMenu.classList.toggle("is-open", !isOpen);
        document.body.classList.toggle("menu-open", !isOpen);
      });

      navMenu.addEventListener("click", (event) => {
        if (event.target.matches("a")) {
          navToggle.setAttribute("aria-expanded", "false");
          navMenu.classList.remove("is-open");
          document.body.classList.remove("menu-open");
        }
      });
    }
  };

  const initRevealAnimations = () => {
    const revealElements = $$(".reveal");
    if (!revealElements.length) return;

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index * 45, 280)}ms`;
      observer.observe(element);
    });
  };

  const initParallax = () => {
    const cards = $$(".parallax-card img");
    if (!cards.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const update = () => {
      cards.forEach((image) => {
        const rect = image.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const imageCenter = rect.top + rect.height / 2;
        const delta = (imageCenter - viewportCenter) * -0.035;
        image.style.transform = `translateY(${delta}px) scale(1.04)`;
      });
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );

    update();
  };

  const propertyCard = (property) => `
    <article class="property-card reveal" data-property-card>
      <a href="property.html?id=${encodeURIComponent(property.id)}" aria-label="View details for ${property.title}">
        <div class="property-image">
          <img src="${property.images[0]}" alt="${property.title}" loading="lazy" width="700" height="525" />
          <div class="badges">
            <span class="badge gold">${property.availability}</span>
            <span class="badge">${property.type}</span>
          </div>
        </div>
        <div class="property-body">
          <h3>${property.title}</h3>
          <p class="property-location">${property.location}</p>
          <div class="property-specs" aria-label="Property specifications">
            <span>${property.bedrooms} Beds</span>
            <span>${property.bathrooms} Baths</span>
            <span>${currencyFormatter.format(property.size)} sq ft</span>
          </div>
          <div class="property-footer">
            <span class="property-price">${property.price}</span>
            <span class="property-link">View Details →</span>
          </div>
        </div>
      </a>
    </article>
  `;

  const getFilterValues = (form) => {
    const data = new FormData(form);
    return {
      location: String(data.get("location") || "").trim().toLowerCase(),
      type: String(data.get("type") || ""),
      price: Number(data.get("price") || 0),
      size: Number(data.get("size") || 0),
      bedrooms: Number(data.get("bedrooms") || 0),
      availability: String(data.get("availability") || "")
    };
  };

  const applyFilters = (items, filters) => {
    return items.filter((property) => {
      const matchesLocation = !filters.location || `${property.location} ${property.address}`.toLowerCase().includes(filters.location);
      const matchesType = !filters.type || property.type === filters.type;
      const matchesPrice = !filters.price || property.priceValue <= filters.price;
      const matchesSize = !filters.size || property.size >= filters.size;
      const matchesBedrooms = !filters.bedrooms || property.bedrooms >= filters.bedrooms;
      const matchesAvailability = !filters.availability || property.availability === filters.availability;

      return matchesLocation && matchesType && matchesPrice && matchesSize && matchesBedrooms && matchesAvailability;
    });
  };

  const sortProperties = (items, sortValue) => {
    const sorted = [...items];
    switch (sortValue) {
      case "price-asc":
        return sorted.sort((a, b) => a.priceValue - b.priceValue);
      case "price-desc":
        return sorted.sort((a, b) => b.priceValue - a.priceValue);
      case "size-desc":
        return sorted.sort((a, b) => b.size - a.size);
      default:
        return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
  };

  const initPropertyListing = () => {
    const grid = $("[data-property-grid]");
    const form = $("[data-filter-form]");
    const count = $("[data-result-count]");
    const emptyState = $("[data-empty-state]");
    const sort = $("[data-sort]");
    const quickSearch = $("[data-quick-search]");

    if (!grid || !form) return;

    const render = () => {
      const filters = getFilterValues(form);
      const sorted = sortProperties(applyFilters(properties, filters), sort?.value || "featured");
      grid.innerHTML = sorted.map(propertyCard).join("");
      if (count) count.textContent = String(sorted.length);
      if (emptyState) emptyState.hidden = sorted.length !== 0;
      initRevealAnimations();
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      render();
    });

    form.addEventListener("reset", () => {
      window.requestAnimationFrame(render);
    });

    sort?.addEventListener("change", render);

    quickSearch?.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(quickSearch);
      form.elements.location.value = data.get("location") || "";
      form.elements.type.value = data.get("type") || "";
      form.elements.price.value = data.get("budget") || "";
      render();
      $("#properties")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    render();
  };

  const setText = (selector, value) => {
    const node = $(selector);
    if (node) node.textContent = value;
  };

  const initPropertyDetail = () => {
    const detailRoot = $("[data-property-detail]");
    if (!detailRoot) return;

    const params = new URLSearchParams(window.location.search);
    const propertyId = params.get("id") || properties[0]?.id;
    const property = properties.find((item) => item.id === propertyId) || properties[0];

    if (!property) {
      detailRoot.innerHTML = `<div class="container"><h1>Property not found</h1><p>Please return to the property listings.</p></div>`;
      return;
    }

    document.title = `${property.title} — LuxEstate`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", `${property.title} in ${property.location}. ${property.description}`);

    setText("[data-detail-title]", property.title);
    setText("[data-detail-location]", property.address);
    setText("[data-detail-price]", property.price);
    setText("[data-detail-availability]", `${property.availability} • ${property.type}`);
    setText("[data-detail-description]", property.description);

    const gallery = $("[data-detail-gallery]");
    if (gallery) {
      gallery.innerHTML = property.images
        .map(
          (image, index) => `
            <button class="gallery-item" type="button" data-gallery-image="${image}" aria-label="Open image ${index + 1} of ${property.title}">
              <img src="${image}" alt="${property.title} view ${index + 1}" loading="${index === 0 ? "eager" : "lazy"}" width="900" height="675" />
            </button>
          `
        )
        .join("");
    }

    const stats = $("[data-detail-stats]");
    if (stats) {
      stats.innerHTML = [
        [property.bedrooms, "Bedrooms"],
        [property.bathrooms, "Bathrooms"],
        [`${currencyFormatter.format(property.size)}`, "Square Feet"],
        [property.type, "Property Type"]
      ]
        .map(([value, label]) => `<div class="detail-stat"><strong>${value}</strong><span>${label}</span></div>`)
        .join("");
    }

    const amenities = $("[data-detail-amenities]");
    if (amenities) {
      amenities.innerHTML = property.amenities.map((amenity) => `<li>${amenity}</li>`).join("");
    }

    const floorPlan = $("[data-detail-floor-plan]");
    if (floorPlan) {
      floorPlan.textContent = property.floorPlan;
    }

    const message = $(".inquiry-card textarea[name='message']");
    if (message) {
      message.value = `I am interested in ${property.title}. Please share availability and viewing options.`;
    }

    const map = $("[data-detail-map]");
    if (map) {
      map.innerHTML = `
        <iframe
          title="Map showing ${property.location}"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=${encodeURIComponent(property.coordinates)}&output=embed">
        </iframe>
      `;
    }

    const structuredData = document.createElement("script");
    structuredData.type = "application/ld+json";
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Residence",
      name: property.title,
      address: property.address,
      description: property.description,
      image: property.images,
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.size,
        unitText: "SQFT"
      },
      numberOfRooms: property.bedrooms
    });
    document.head.appendChild(structuredData);
  };

  const initLightbox = () => {
    const lightbox = $("[data-lightbox]");
    const lightboxImage = $("[data-lightbox-image]");
    const closeButton = $("[data-lightbox-close]");
    if (!lightbox || !lightboxImage) return;

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-gallery-image]");
      if (!button) return;
      lightboxImage.src = button.dataset.galleryImage;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      closeButton?.focus();
    });

    const close = () => {
      lightbox.hidden = true;
      lightboxImage.src = "";
      document.body.style.overflow = "";
    };

    closeButton?.addEventListener("click", close);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightbox.hidden) close();
    });
  };

  const initContactForms = () => {
    $$('[data-contact-form]').forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const note = $("[data-form-note]", form);
        if (note) {
          note.textContent = "Thank you. Your inquiry is ready for backend lead capture integration.";
        }
        form.reset();
      });
    });
  };

  const initFooterYear = () => {
    $$('[data-year]').forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initPropertyListing();
    initPropertyDetail();
    initLightbox();
    initContactForms();
    initFooterYear();
    initRevealAnimations();
    initParallax();
  });
})();
