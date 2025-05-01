/**
 * Website module for website creation, editing, and management
 * Handles website editor, content generation, and preview functionality
 */

// Website editor functionality
const websiteEditor = {
  // Initialize website editor
  init: function () {
    // Setup section toggle buttons
    this.setupSectionToggles();

    // Setup dynamic forms (services, features, testimonials)
    this.setupDynamicForms();

    // Setup color pickers
    this.setupColorPickers();

    // Setup save buttons
    this.setupSaveButtons();

    // Setup delete website functionality
    this.setupDeleteWebsite();

    // Setup regenerate content functionality
    this.setupRegenerateContent();
  },

  // Setup section toggle buttons (expand/collapse)
  setupSectionToggles: function () {
    document.querySelectorAll(".section-toggle").forEach((button) => {
      button.addEventListener("click", function () {
        const targetId = this.getAttribute("data-target");
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const isVisible = targetElement.style.display !== "none";

          if (isVisible) {
            targetElement.style.display = "none";
            this.innerHTML = '<i class="bi bi-chevron-down"></i>';
          } else {
            targetElement.style.display = "block";
            this.innerHTML = '<i class="bi bi-chevron-up"></i>';
          }
        }
      });
    });
  },

  // Setup dynamic forms (add/remove services, features, testimonials)
  setupDynamicForms: function () {
    // Add service button
    const addServiceBtn = document.getElementById("addServiceBtn");
    if (addServiceBtn) {
      addServiceBtn.addEventListener("click", function () {
        const servicesContainer = document.getElementById("servicesContainer");
        const serviceCount =
          servicesContainer.querySelectorAll(".service-item").length;

        const serviceTemplate = `
                    <div class="card mb-3 service-item">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-0">Service ${
                                  serviceCount + 1
                                }</h6>
                                <button type="button" class="btn btn-sm btn-outline-danger remove-service-btn">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Title</label>
                                <input type="text" class="form-control" name="services[${serviceCount}].title" value="New Service">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea class="form-control" name="services[${serviceCount}].description" rows="2">Service description goes here</textarea>
                            </div>
                            <div class="mb-0">
                                <label class="form-label">Icon</label>
                                <input type="text" class="form-control" name="services[${serviceCount}].icon" value="gear">
                                <div class="form-text">Use Bootstrap Icons name (e.g. gear, graph-up, people)</div>
                            </div>
                        </div>
                    </div>
                `;

        servicesContainer.insertAdjacentHTML("beforeend", serviceTemplate);

        // Setup remove button for the new service
        const newServiceItem = servicesContainer.lastElementChild;
        const removeButton = newServiceItem.querySelector(
          ".remove-service-btn"
        );
        removeButton.addEventListener("click", function () {
          newServiceItem.remove();
          websiteEditor.updateServiceIndices();
        });
      });
    }

    // Setup existing remove service buttons
    document.querySelectorAll(".remove-service-btn").forEach((button) => {
      button.addEventListener("click", function () {
        if (!this.disabled) {
          this.closest(".service-item").remove();
          websiteEditor.updateServiceIndices();
        }
      });
    });

    // Add feature button
    const addFeatureBtn = document.getElementById("addFeatureBtn");
    if (addFeatureBtn) {
      addFeatureBtn.addEventListener("click", function () {
        const featuresContainer = document.getElementById("featuresContainer");
        const featureCount =
          featuresContainer.querySelectorAll(".feature-item").length;

        const featureTemplate = `
                    <div class="card mb-3 feature-item">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-0">Feature ${
                                  featureCount + 1
                                }</h6>
                                <button type="button" class="btn btn-sm btn-outline-danger remove-feature-btn">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Title</label>
                                <input type="text" class="form-control" name="features[${featureCount}].title" value="New Feature">
                            </div>
                            <div class="mb-0">
                                <label class="form-label">Description</label>
                                <textarea class="form-control" name="features[${featureCount}].description" rows="2">Feature description goes here</textarea>
                            </div>
                        </div>
                    </div>
                `;

        featuresContainer.insertAdjacentHTML("beforeend", featureTemplate);

        // Setup remove button for the new feature
        const newFeatureItem = featuresContainer.lastElementChild;
        const removeButton = newFeatureItem.querySelector(
          ".remove-feature-btn"
        );
        removeButton.addEventListener("click", function () {
          newFeatureItem.remove();
          websiteEditor.updateFeatureIndices();
        });
      });
    }

    // Setup existing remove feature buttons
    document.querySelectorAll(".remove-feature-btn").forEach((button) => {
      button.addEventListener("click", function () {
        if (!this.disabled) {
          this.closest(".feature-item").remove();
          websiteEditor.updateFeatureIndices();
        }
      });
    });

    // Add testimonial button
    const addTestimonialBtn = document.getElementById("addTestimonialBtn");
    if (addTestimonialBtn) {
      addTestimonialBtn.addEventListener("click", function () {
        const testimonialsContainer = document.getElementById(
          "testimonialsContainer"
        );
        const testimonialCount =
          testimonialsContainer.querySelectorAll(".testimonial-item").length;

        const testimonialTemplate = `
                    <div class="card mb-3 testimonial-item">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-0">Testimonial ${
                                  testimonialCount + 1
                                }</h6>
                                <button type="button" class="btn btn-sm btn-outline-danger remove-testimonial-btn">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Quote</label>
                                <textarea class="form-control" name="testimonials[${testimonialCount}].quote" rows="2">New testimonial quote</textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Author</label>
                                <input type="text" class="form-control" name="testimonials[${testimonialCount}].author" value="John Doe">
                            </div>
                            <div class="mb-0">
                                <label class="form-label">Position/Company</label>
                                <input type="text" class="form-control" name="testimonials[${testimonialCount}].position" value="CEO, Company Inc.">
                            </div>
                        </div>
                    </div>
                `;

        testimonialsContainer.insertAdjacentHTML(
          "beforeend",
          testimonialTemplate
        );

        // Setup remove button for the new testimonial
        const newTestimonialItem = testimonialsContainer.lastElementChild;
        const removeButton = newTestimonialItem.querySelector(
          ".remove-testimonial-btn"
        );
        removeButton.addEventListener("click", function () {
          newTestimonialItem.remove();
          websiteEditor.updateTestimonialIndices();
        });
      });
    }

    // Setup existing remove testimonial buttons
    document.querySelectorAll(".remove-testimonial-btn").forEach((button) => {
      button.addEventListener("click", function () {
        if (!this.disabled) {
          this.closest(".testimonial-item").remove();
          websiteEditor.updateTestimonialIndices();
        }
      });
    });
  },

  // Update service indices after adding or removing services
  updateServiceIndices: function () {
    const servicesContainer = document.getElementById("servicesContainer");
    if (!servicesContainer) return;

    const serviceItems = servicesContainer.querySelectorAll(".service-item");

    serviceItems.forEach((item, index) => {
      // Update heading
      const heading = item.querySelector("h6");
      if (heading) {
        heading.textContent = `Service ${index + 1}`;
      }

      // Update input names
      const inputs = item.querySelectorAll("input, textarea");
      inputs.forEach((input) => {
        const name = input.getAttribute("name");
        if (name) {
          const newName = name.replace(/services\[\d+\]/, `services[${index}]`);
          input.setAttribute("name", newName);
        }
      });

      // Disable remove button for the first service
      const removeButton = item.querySelector(".remove-service-btn");
      if (removeButton) {
        removeButton.disabled = index === 0 && serviceItems.length === 1;
      }
    });
  },

  // Update feature indices after adding or removing features
  updateFeatureIndices: function () {
    const featuresContainer = document.getElementById("featuresContainer");
    if (!featuresContainer) return;

    const featureItems = featuresContainer.querySelectorAll(".feature-item");

    featureItems.forEach((item, index) => {
      // Update heading
      const heading = item.querySelector("h6");
      if (heading) {
        heading.textContent = `Feature ${index + 1}`;
      }

      // Update input names
      const inputs = item.querySelectorAll("input, textarea");
      inputs.forEach((input) => {
        const name = input.getAttribute("name");
        if (name) {
          const newName = name.replace(/features\[\d+\]/, `features[${index}]`);
          input.setAttribute("name", newName);
        }
      });

      // Disable remove button for the first feature
      const removeButton = item.querySelector(".remove-feature-btn");
      if (removeButton) {
        removeButton.disabled = index === 0 && featureItems.length === 1;
      }
    });
  },

  // Update testimonial indices after adding or removing testimonials
  updateTestimonialIndices: function () {
    const testimonialsContainer = document.getElementById(
      "testimonialsContainer"
    );
    if (!testimonialsContainer) return;

    const testimonialItems =
      testimonialsContainer.querySelectorAll(".testimonial-item");

    testimonialItems.forEach((item, index) => {
      // Update heading
      const heading = item.querySelector("h6");
      if (heading) {
        heading.textContent = `Testimonial ${index + 1}`;
      }

      // Update input names
      const inputs = item.querySelectorAll("input, textarea");
      inputs.forEach((input) => {
        const name = input.getAttribute("name");
        if (name) {
          const newName = name.replace(
            /testimonials\[\d+\]/,
            `testimonials[${index}]`
          );
          input.setAttribute("name", newName);
        }
      });

      // Disable remove button for the first testimonial
      const removeButton = item.querySelector(".remove-testimonial-btn");
      if (removeButton) {
        removeButton.disabled = index === 0 && testimonialItems.length === 1;
      }
    });
  },

  // Setup color pickers
  setupColorPickers: function () {
    // Primary color picker
    const primaryColorPicker = document.getElementById("primaryColor");
    const primaryColorText = document.getElementById("primaryColorText");
    if (primaryColorPicker && primaryColorText) {
      primaryColorPicker.addEventListener("input", function () {
        primaryColorText.value = this.value;
        websiteEditor.updateColorPreview();
      });

      primaryColorText.addEventListener("input", function () {
        primaryColorPicker.value = this.value;
        websiteEditor.updateColorPreview();
      });
    }

    // Secondary color picker
    const secondaryColorPicker = document.getElementById("secondaryColor");
    const secondaryColorText = document.getElementById("secondaryColorText");
    if (secondaryColorPicker && secondaryColorText) {
      secondaryColorPicker.addEventListener("input", function () {
        secondaryColorText.value = this.value;
        websiteEditor.updateColorPreview();
      });

      secondaryColorText.addEventListener("input", function () {
        secondaryColorPicker.value = this.value;
        websiteEditor.updateColorPreview();
      });
    }

    // Accent color picker
    const accentColorPicker = document.getElementById("accentColor");
    const accentColorText = document.getElementById("accentColorText");
    if (accentColorPicker && accentColorText) {
      accentColorPicker.addEventListener("input", function () {
        accentColorText.value = this.value;
        websiteEditor.updateColorPreview();
      });

      accentColorText.addEventListener("input", function () {
        accentColorPicker.value = this.value;
        websiteEditor.updateColorPreview();
      });
    }

    // Text color picker
    const textColorPicker = document.getElementById("textColor");
    const textColorText = document.getElementById("textColorText");
    if (textColorPicker && textColorText) {
      textColorPicker.addEventListener("input", function () {
        textColorText.value = this.value;
        websiteEditor.updateColorPreview();
      });

      textColorText.addEventListener("input", function () {
        textColorPicker.value = this.value;
        websiteEditor.updateColorPreview();
      });
    }

    // Background color picker
    const backgroundColorPicker = document.getElementById("backgroundColor");
    const backgroundColorText = document.getElementById("backgroundColorText");
    if (backgroundColorPicker && backgroundColorText) {
      backgroundColorPicker.addEventListener("input", function () {
        backgroundColorText.value = this.value;
        websiteEditor.updateColorPreview();
      });

      backgroundColorText.addEventListener("input", function () {
        backgroundColorPicker.value = this.value;
        websiteEditor.updateColorPreview();
      });
    }

    // Update color preview initially
    this.updateColorPreview();
  },

  // Update color preview
  updateColorPreview: function () {
    const colorPreview = document.getElementById("colorPreview");
    if (!colorPreview) return;

    const primaryColor =
      document.getElementById("primaryColor")?.value || "#007bff";
    const secondaryColor =
      document.getElementById("secondaryColor")?.value || "#6c757d";
    const accentColor =
      document.getElementById("accentColor")?.value || "#fd7e14";
    const textColor = document.getElementById("textColor")?.value || "#212529";
    const backgroundColor =
      document.getElementById("backgroundColor")?.value || "#ffffff";

    // Update preview styles
    colorPreview.style.backgroundColor = backgroundColor;
    colorPreview.querySelector("h3").style.color = primaryColor;
    colorPreview.querySelector("p").style.color = textColor;

    // Update button styles
    const buttons = colorPreview.querySelectorAll(".btn");
    buttons[0].style.backgroundColor = primaryColor;
    buttons[0].style.borderColor = primaryColor;
    buttons[0].style.color = backgroundColor;

    buttons[1].style.backgroundColor = secondaryColor;
    buttons[1].style.borderColor = secondaryColor;
    buttons[1].style.color = backgroundColor;

    buttons[2].style.backgroundColor = accentColor;
    buttons[2].style.borderColor = accentColor;
    buttons[2].style.color = backgroundColor;
  },

  // Setup save buttons
  setupSaveButtons: function () {
    // Save content button
    const saveContentBtn = document.getElementById("saveContentBtn");
    if (saveContentBtn) {
      saveContentBtn.addEventListener("click", function () {
        const websiteId = document.getElementById("websiteId").value;
        const formData = websiteEditor.collectContentFormData();

        websiteEditor.saveWebsiteContent(websiteId, formData);
      });
    }

    // Save style button
    const saveStyleBtn = document.getElementById("saveStyleBtn");
    if (saveStyleBtn) {
      saveStyleBtn.addEventListener("click", function () {
        const websiteId = document.getElementById("websiteId").value;
        const formData = websiteEditor.collectStyleFormData();

        websiteEditor.saveWebsiteStyle(websiteId, formData);
      });
    }

    // Save settings button
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener("click", function () {
        const websiteId = document.getElementById("websiteId").value;
        const formData = websiteEditor.collectSettingsFormData();

        websiteEditor.saveWebsiteSettings(websiteId, formData);
      });
    }
  },

  // Collect content form data
  collectContentFormData: function () {
    const contentFormData = {
      content: {
        hero: {
          headline: document.getElementById("heroHeadline")?.value || "",
          subheading: document.getElementById("heroSubheading")?.value || "",
        },
        about: {
          title: document.getElementById("aboutTitle")?.value || "",
          description: document.getElementById("aboutDescription")?.value || "",
          mission: document.getElementById("aboutMission")?.value || "",
        },
        services: [],
        features: [],
        testimonials: [],
        contact: {
          title: document.getElementById("contactTitle")?.value || "",
          message: document.getElementById("contactMessage")?.value || "",
        },
      },
    };

    // Collect services
    const servicesContainer = document.getElementById("servicesContainer");
    if (servicesContainer) {
      const serviceItems = servicesContainer.querySelectorAll(".service-item");
      serviceItems.forEach((item, index) => {
        const service = {
          title:
            item.querySelector(`[name="services[${index}].title"]`)?.value ||
            "",
          description:
            item.querySelector(`[name="services[${index}].description"]`)
              ?.value || "",
          icon:
            item.querySelector(`[name="services[${index}].icon"]`)?.value || "",
        };
        contentFormData.content.services.push(service);
      });
    }

    // Collect features
    const featuresContainer = document.getElementById("featuresContainer");
    if (featuresContainer) {
      const featureItems = featuresContainer.querySelectorAll(".feature-item");
      featureItems.forEach((item, index) => {
        const feature = {
          title:
            item.querySelector(`[name="features[${index}].title"]`)?.value ||
            "",
          description:
            item.querySelector(`[name="features[${index}].description"]`)
              ?.value || "",
        };
        contentFormData.content.features.push(feature);
      });
    }

    // Collect testimonials
    const testimonialsContainer = document.getElementById(
      "testimonialsContainer"
    );
    if (testimonialsContainer) {
      const testimonialItems =
        testimonialsContainer.querySelectorAll(".testimonial-item");
      testimonialItems.forEach((item, index) => {
        const testimonial = {
          quote:
            item.querySelector(`[name="testimonials[${index}].quote"]`)
              ?.value || "",
          author:
            item.querySelector(`[name="testimonials[${index}].author"]`)
              ?.value || "",
          position:
            item.querySelector(`[name="testimonials[${index}].position"]`)
              ?.value || "",
        };
        contentFormData.content.testimonials.push(testimonial);
      });
    }

    return contentFormData;
  },

  // Collect style form data
  collectStyleFormData: function () {
    const styleFormData = {
      content: {
        colors: {
          primary: document.getElementById("primaryColor")?.value || "#007bff",
          secondary:
            document.getElementById("secondaryColor")?.value || "#6c757d",
          accent: document.getElementById("accentColor")?.value || "#fd7e14",
          text: document.getElementById("textColor")?.value || "#212529",
          background:
            document.getElementById("backgroundColor")?.value || "#ffffff",
        },
      },
    };

    return styleFormData;
  },

  // Collect settings form data
  collectSettingsFormData: function () {
    const settingsFormData = {
      title: document.getElementById("websiteTitle")?.value || "",
      template: document.getElementById("templateSelect")?.value || "default",
      status: document.getElementById("websiteStatus")?.value || "draft",
      content: {
        enableContactForm:
          document.getElementById("enableContactForm")?.checked || false,
      },
    };

    return settingsFormData;
  },

  // Save website content
  saveWebsiteContent: function (websiteId, formData) {
    const loadingModal = new bootstrap.Modal(
      document.getElementById("loadingModal")
    );

    // Update loading message
    document.getElementById("loadingMessage").textContent =
      "Saving website content...";

    // Show loading modal
    loadingModal.show();

    // Send API request
    fetch(`/website/${websiteId}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save content");
        }
        return response.json();
      })
      .then((data) => {
        // Hide loading modal
        loadingModal.hide();
        document.getElementById("loadingModal").classList.remove("show");
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

        // Show success message
        showNotification("Website content saved successfully", "success");

        // Redirect to website list after a short delay
        setTimeout(() => {
          window.location.href = "/website";
        }, 1000);
      })
      .catch((error) => {
        // Hide loading modal
        loadingModal.hide();
        document.getElementById("loadingModal").classList.remove("show");
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

        // Show error message
        showNotification(`Error: ${error.message}`, "danger");
        console.error("Error saving website content:", error);
      });
  },

  // Save website style
  saveWebsiteStyle: function (websiteId, formData) {
    const loadingModal = new bootstrap.Modal(
      document.getElementById("loadingModal")
    );

    // Update loading message
    document.getElementById("loadingMessage").textContent =
      "Saving website style...";

    // Show loading modal
    loadingModal.show();

    // Send API request
    fetch(`/website/${websiteId}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save style");
        }
        return response.json();
      })
      .then((data) => {
        // Hide loading modal
        loadingModal.hide();
        document.getElementById("loadingModal").classList.remove("show");
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

        // Show success message
        showNotification("Website style saved successfully", "success");

        // Redirect to website list after a short delay
        setTimeout(() => {
          window.location.href = "/website";
        }, 1000);
      })
      .catch((error) => {
        // Hide loading modal
        loadingModal.hide();
        document.getElementById("loadingModal").classList.remove("show");
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

        // Show error message
        showNotification(`Error: ${error.message}`, "danger");
        console.error("Error saving website style:", error);
      });
  },

  // Save website settings
  saveWebsiteSettings: function (websiteId, formData) {
    const loadingModal = new bootstrap.Modal(
      document.getElementById("loadingModal")
    );

    // Update loading message
    document.getElementById("loadingMessage").textContent =
      "Saving website settings...";

    // Show loading modal
    loadingModal.show();

    // Send API request
    fetch(`/website/${websiteId}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save settings");
        }
        return response.json();
      })
      .then((data) => {
        // Hide loading modal
        loadingModal.hide();
        document.getElementById("loadingModal").classList.remove("show");
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

        // Show success message
        showNotification("Website settings saved successfully", "success");

        // Redirect to website list after a short delay
        setTimeout(() => {
          window.location.href = "/website";
        }, 1000);
      })
      .catch((error) => {
        // Hide loading modal
        loadingModal.hide();
        document.getElementById("loadingModal").classList.remove("show");
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

        // Show error message
        showNotification(`Error: ${error.message}`, "danger");
        console.error("Error saving website settings:", error);
      });
  },

  // Setup delete website functionality
  setupDeleteWebsite: function () {
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    if (!confirmDeleteBtn) return;

    confirmDeleteBtn.addEventListener("click", function () {
      const websiteId = document.getElementById("deleteWebsiteId")?.value;

      if (!websiteId) {
        // Try to get website ID from the URL
        const urlPathSegments = window.location.pathname.split("/");
        const urlWebsiteId = urlPathSegments[urlPathSegments.length - 2];

        if (urlWebsiteId) {
          websiteEditor.deleteWebsite(urlWebsiteId);
        } else {
          showNotification("Website ID not found", "danger");
        }
      } else {
        websiteEditor.deleteWebsite(websiteId);
      }
    });
  },

  // Delete website
  deleteWebsite: function (websiteId) {
    // Hide delete modal
    const deleteModal = bootstrap.Modal.getInstance(
      document.getElementById("deleteWebsiteModal")
    );
    if (deleteModal) {
      deleteModal.hide();
      document.getElementById("deleteWebsiteModal").classList.remove("show");
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    const loadingModal = new bootstrap.Modal(
      document.getElementById("loadingModal")
    );

    // Update loading message
    document.getElementById("loadingMessage").textContent =
      "Deleting website...";

    // Show loading modal
    loadingModal.show();

    // Send API request
    fetch(`/website/${websiteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete website");
        }
        return response.json();
      })
      .then((data) => {
        // Hide loading modal
        loadingModal.hide();
        document.getElementById("loadingModal").classList.remove("show");
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

        // Show success message and redirect
        showNotification("Website deleted successfully", "success");

        // Redirect to websites list
        window.location.href = "/website/";
      })
      .catch((error) => {
        // Hide loading modal
        loadingModal.hide();
        document.getElementById("loadingModal").classList.remove("show");
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

        // Show error message
        showNotification(`Error: ${error.message}`, "danger");
        console.error("Error deleting website:", error);
      });
  },

  // Setup regenerate content functionality
  setupRegenerateContent: function () {
    const regenerateContentBtn = document.getElementById(
      "regenerateContentBtn"
    );
    if (!regenerateContentBtn) return;

    regenerateContentBtn.addEventListener("click", function () {
      const websiteId = document.getElementById("websiteId").value;

      const formData = {
        business_type: document.getElementById("regenerateBusinessType").value,
        industry: document.getElementById("regenerateIndustry").value,
        business_name: document.getElementById("regenerateBusinessName").value,
        additional_info: document.getElementById("regenerateAdditionalInfo")
          .value,
      };

      websiteEditor.regenerateContent(websiteId, formData);
    });

    // Setup regenerate colors button
    const regenerateColorsBtn = document.getElementById("regenerateColorsBtn");
    if (regenerateColorsBtn) {
      regenerateColorsBtn.addEventListener("click", function () {
        const businessType =
          document.getElementById("regenerateBusinessType")?.value ||
          "business";
        const industry =
          document.getElementById("regenerateIndustry")?.value || "general";

        websiteEditor.regenerateColorScheme(businessType, industry);
      });
    }
  },

  // Regenerate website content
  regenerateContent: function (websiteId, formData) {
    const loadingModal = new bootstrap.Modal(
      document.getElementById("loadingModal")
    );

    // Update loading message
    document.getElementById("loadingModalLabel").textContent =
      "Regenerating Content";
    document.getElementById("loadingMessage").textContent =
      "Our AI is creating new content for your website. This may take a minute...";

    // Show loading modal
    loadingModal.show();

    // Send API request
    fetch(`/website/${websiteId}/regenerate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authManager.getToken()}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to regenerate content");
        }
        return response.json();
      })
      .then((data) => {
        // Hide loading modal
        loadingModal.hide();
        document.getElementById("loadingModal").classList.remove("show");
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

        // Show success message
        showNotification("Website content regenerated successfully", "success");

        // Reload page to show new content after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        // Hide loading modal
        loadingModal.hide();
        document.getElementById("loadingModal").classList.remove("show");
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

        // Show error message
        showNotification(`Error: ${error.message}`, "danger");
      });
  },

  // Regenerate color scheme
  regenerateColorScheme: function (businessType, industry) {
    const loadingModal = new bootstrap.Modal(
      document.getElementById("loadingModal")
    );

    // Update loading message
    document.getElementById("loadingModalLabel").textContent =
      "Generating Colors";
    document.getElementById("loadingMessage").textContent =
      "Generating a new color scheme for your website...";

    // Show loading modal
    loadingModal.show();

    // Send API request to backend (implementation would depend on your backend structure)
    // This is a simplified version - you would need to create an endpoint for this
    fetch(
      `/api/colors/generate?business_type=${businessType}&industry=${industry}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authManager.getToken()}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to generate color scheme");
        }
        return response.json();
      })
      .then((data) => {
        // Hide loading modal
        loadingModal.hide();
        document.getElementById("loadingModal").classList.remove("show");
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

        // Update color pickers with new values
        if (data && data.colors) {
          document.getElementById("primaryColor").value = data.colors.primary;
          document.getElementById("primaryColorText").value =
            data.colors.primary;

          document.getElementById("secondaryColor").value =
            data.colors.secondary;
          document.getElementById("secondaryColorText").value =
            data.colors.secondary;

          document.getElementById("accentColor").value = data.colors.accent;
          document.getElementById("accentColorText").value = data.colors.accent;

          document.getElementById("textColor").value = data.colors.text;
          document.getElementById("textColorText").value = data.colors.text;

          document.getElementById("backgroundColor").value =
            data.colors.background;
          document.getElementById("backgroundColorText").value =
            data.colors.background;

          // Update preview
          websiteEditor.updateColorPreview();

          // Show success message
          showNotification("Color scheme regenerated successfully", "success");

          // Redirect to website list after a short delay
          setTimeout(() => {
            window.location.href = "/website";
          }, 1000);
        }
      })
      .catch((error) => {
        // Hide loading modal
        loadingModal.hide();
        document.getElementById("loadingModal").classList.remove("show");
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

        // Show error message
        showNotification(`Error: ${error.message}`, "danger");
      });
  },
};

// Website list functionality
const websiteList = {
  // Initialize website list
  init: function () {
    this.setupSearchFilter();
    this.setupStatusToggle();
    this.setupDeleteWebsite();
  },

  // Setup search and filter functionality
  setupSearchFilter: function () {
    const searchInput = document.getElementById("searchWebsites");
    const filterStatus = document.getElementById("filterStatus");
    const sortOrder = document.getElementById("sortOrder");

    if (searchInput && filterStatus && sortOrder) {
      // Search input event
      searchInput.addEventListener("input", this.filterWebsites);

      // Filter status change event
      filterStatus.addEventListener("change", this.filterWebsites);

      // Sort order change event
      sortOrder.addEventListener("change", this.sortWebsites);
    }
  },

  // Filter websites based on search and filter
  filterWebsites: function () {
    const searchInput = document.getElementById("searchWebsites");
    const filterStatus = document.getElementById("filterStatus");
    const websiteItems = document.querySelectorAll(".website-item");

    const searchTerm = searchInput.value.toLowerCase();
    const statusFilter = filterStatus.value.toLowerCase();

    websiteItems.forEach((item) => {
      const title = item.dataset.title.toLowerCase();
      const status = item.dataset.status.toLowerCase();

      const matchesSearch = title.includes(searchTerm);
      const matchesStatus = statusFilter === "" || status === statusFilter;

      if (matchesSearch && matchesStatus) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  },

  // Sort websites based on sort order
  sortWebsites: function () {
    const sortOrder = document.getElementById("sortOrder");
    const websiteItems = Array.from(document.querySelectorAll(".website-item"));
    const container = websiteItems[0]?.parentNode;

    if (!container) return;

    websiteItems.sort((a, b) => {
      const titleA = a.dataset.title.toLowerCase();
      const titleB = b.dataset.title.toLowerCase();
      const dateA = new Date(
        a.querySelector(".created-date")?.textContent || 0
      );
      const dateB = new Date(
        b.querySelector(".created-date")?.textContent || 0
      );

      switch (sortOrder.value) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "az":
          return titleA.localeCompare(titleB);
        case "za":
          return titleB.localeCompare(titleA);
        default:
          return 0;
      }
    });

    websiteItems.forEach((website) => container.appendChild(website));
  },

  // Setup status toggle functionality
  setupStatusToggle: function () {
    document.querySelectorAll(".status-toggle-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const websiteId = this.getAttribute("data-website-id");
        const currentStatus = this.getAttribute("data-current-status");
        const targetStatus = this.getAttribute("data-target-status");

        if (websiteId && targetStatus) {
          websiteList.toggleWebsiteStatus(websiteId, targetStatus);
        }
      });
    });
  },

  // Toggle website status (draft/published)
  toggleWebsiteStatus: function (websiteId, status) {
    // Send API request
    fetch(`/website/${websiteId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authManager.getToken()}`,
      },
      body: JSON.stringify({ status: status }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to ${
              status === "published" ? "publish" : "unpublish"
            } website`
          );
        }
        return response.json();
      })
      .then((data) => {
        // Show success message
        showNotification(
          `Website ${
            status === "published" ? "published" : "unpublished"
          } successfully`,
          "success"
        );

        // Reload page to show updated status
        window.location.reload();
      })
      .catch((error) => {
        // Show error message
        showNotification(`Error: ${error.message}`, "danger");
      });
  },

  // Setup delete website functionality
  setupDeleteWebsite: function () {
    // Setup delete website button click
    document.querySelectorAll(".delete-website-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const websiteId = this.getAttribute("data-website-id");
        const websiteTitle = this.getAttribute("data-website-title");

        if (websiteId) {
          // Set values in the modal
          document.getElementById("deleteWebsiteId").value = websiteId;
          document.getElementById("deleteWebsiteTitle").textContent =
            websiteTitle;
        }
      });
    });

    // Setup confirm delete button click
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener("click", function () {
        const websiteId = document.getElementById("deleteWebsiteId").value;

        if (websiteId) {
          websiteList.deleteWebsite(websiteId);
        }
      });
    }
  },

  // Delete website
  deleteWebsite: function (websiteId) {
    // Hide delete modal
    const deleteModal = bootstrap.Modal.getInstance(
      document.getElementById("deleteWebsiteModal")
    );
    if (deleteModal) {
      deleteModal.hide();
    }

    // Send API request
    fetch(`/website/${websiteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authManager.getToken()}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete website");
        }
        return response.json();
      })
      .then((data) => {
        // Show success message
        showNotification("Website deleted successfully", "success");

        // Remove the website item from the DOM
        const websiteItem = document.querySelector(
          `[data-website-id="${websiteId}"]`
        );
        if (websiteItem) {
          websiteItem.remove();
        } else {
          // Reload page if item can't be found
          window.location.reload();
        }
      })
      .catch((error) => {
        // Show error message
        showNotification(`Error: ${error.message}`, "danger");
      });
  },
};

// Initialize on DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on the website editor page
  if (document.getElementById("websiteEditorTabs")) {
    websiteEditor.init();
  }

  // Check if we're on the website list page
  if (document.querySelector(".website-item")) {
    websiteList.init();
  }

  // Website Preview - Device toggle
  const deviceToggleBtn = document.getElementById("deviceToggleBtn");
  const previewContainer = document.getElementById("previewContainer");

  if (deviceToggleBtn && previewContainer) {
    deviceToggleBtn.addEventListener("click", function () {
      const currentDevice = deviceToggleBtn.getAttribute("data-device");

      if (currentDevice === "desktop") {
        // Switch to mobile view
        previewContainer.style.maxWidth = "375px";
        previewContainer.style.margin = "0 auto";
        previewContainer.style.border = "10px solid #343a40";
        previewContainer.style.borderRadius = "20px";
        deviceToggleBtn.setAttribute("data-device", "mobile");
        deviceToggleBtn.innerHTML = '<i class="bi bi-laptop"></i> Desktop View';
      } else {
        // Switch to desktop view
        previewContainer.style.maxWidth = "none";
        previewContainer.style.margin = "0";
        previewContainer.style.border = "none";
        previewContainer.style.borderRadius = "0";
        deviceToggleBtn.setAttribute("data-device", "desktop");
        deviceToggleBtn.innerHTML = '<i class="bi bi-phone"></i> Mobile View';
      }
    });
  }
});
