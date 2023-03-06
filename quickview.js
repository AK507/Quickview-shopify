var curProduct;
var productJson;
var selectedVariant;

function getCalcPrice(valueType, val) {
  if (valueType === "percentage") {
    let calcPrice = selectedVariant.price - (selectedVariant.price * val) / 100;
    return Shopify.formatMoney(calcPrice);
  } else {
    let calcPrice = selectedVariant.price - val;
    return Shopify.formatMoney(calcPrice);
  }
}
$(document).on("click", ".dogs-product-card .full-link, .slide-button > a", function (e) {
  e.preventDefault();
  let scriptID = "#" + $(this).data("script");
  productJson = $(scriptID).html();
  product = JSON.parse(productJson);
  curProduct = product;
  console.log(product.title);
  let image = product.media[0].src;
  let imageAlt = product.media[0].alt;
  let title = product.title;
  let vendor = product.vendor;
  let description = product.description;
  let qvPrice = Shopify.formatMoney(product.price);
  let variants = product.variants;
  let varHtml = `<div class="qv-swatch">`;
  let sellingPlans = product.selling_plan_groups;
  //console.log(sellingPlans);
  let variantCount = 0;
  for (i = 0; i <= variants.length - 1; i++) {
    if (i == 0) {
      selectedVariant = variants[i];
    }
    let vt = variants[i].title;
    let vi = variants[i].id;
    let variantPrice = Shopify.formatMoney(variants[i].price);
    
    if(vt != "Default Title") {
      variantCount = variantCount + 1;
      varHtml += `<span class="qv-swatch-item ${
        i == 0 ? "active" : null
      }" data-id="${vi}">
      <input type="radio" name="qv-variant" value="${vi}" data-price="${variantPrice}" ${
        i == 0 ? "checked" : null
      }>${vt}</span>`;
    }
    else {
      variantCount = variantCount + 1;
      varHtml += `<span style="display:none;" class="qv-swatch-item ${
        i == 0 ? "active" : null
      }" data-id="${vi}">
      <input type="radio" name="qv-variant" value="${vi}" data-price="${variantPrice}" ${
        i == 0 ? "checked" : null
      }>${vt}</span>`;
    }
  }
  varHtml += `</div>`;

  let sellingPlanHtml;
  if (sellingPlans.length > 0) {
    sellingPlanHtml = `<select class="recurring-options-selector">`;
    sellingPlans.map((plans) => {
      plans.selling_plans.map((sel, key) => {
        let valueType = sel.price_adjustments[0].value_type; //amount or percentage
        let val = sel.price_adjustments[0].value; // amout value or percentage value

        sellingPlanHtml += `<option value="${
          sel.id
        }" data-dis-type="${valueType}" data-dis-amount="${val}" data-plan-option="${
          sel.name
        }">${sel.name.replace("Delivery every", "")}</option>`;
      });
    });
    sellingPlanHtml += `</select>`;
  }

  let ingredintsList = "";
  let ingredintsHtml = "";
  curProduct.tags.map((tag)=>{
    if(tag.indexOf("Ingredients") > - 1 || tag.indexOf("ingredients") > - 1) {
        ingredintsList += `<li>${tag.split("_")[1]}</li>`;
    }
  });

  if(ingredintsList != "") {
    ingredintsHtml += `<div class="qv-ingredients-wrapper"><h3>Some facts about the supplement here</h3><ul class="ingredientList">${ingredintsList}</ul></div>`;
  }
console.log(ingredintsHtml);
  let widgetHtml;
  if (sellingPlanHtml) {
    widgetHtml += `<div class="subscription-selector">
    <ul>
    <li class="onetime-purchase active"><label><input type="radio" name="subscription_option" checked> <span class="widget-text">One-time purchase</span> </label></li>
    <li class="recurring-subscribe"><label><input type="radio" name="subscription_option"> <span class="widget-text">Subscribe</span> &nbsp;&mdash; <span class="recurring-options">${sellingPlanHtml}</span></label></li>
    </ul>
    </div>
    `;
  }

  let html = `
  <div class="quick-view-container" style="display:none;">
    <div class="quick-view-wrapper">
    <span class="quick-close">X</span>
      <div class="quick-product-image">
            <img src="${image}" alt="imageAlt" />
      </div>
      <div class="quick-product-info">
        <div class="quick-header">
          <p class="vendor">${vendor}</p>
          <h2>${title}</h2>
          <div class="quick-description">
            ${description}
          </div>
        </div>
        <div class="quick-variants">
          ${varHtml}
        </div>
        ${ingredintsHtml}
        <div class="qv-selling-plans">
          ${widgetHtml ? widgetHtml : ""}
        </div>
        <div class="quick-selecter">
          <button class="minus" data-multi="-1"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-minus" fill="none" viewBox="0 0 10 2">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M.5 1C.5.7.7.5 1 .5h8a.5.5 0 110 1H1A.5.5 0 01.5 1z" fill="currentColor">
</path></svg></button>
          <input id="qty_input" type="number" name="quantity" min="1" value="1">
          <button class="plus" data-multi="1"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-plus" fill="none" viewBox="0 0 10 10">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z" fill="currentColor">
</path></svg></button>
        </div>
        <div class="quick-action">
          <button type="button" class="button button--full-width button--primary qv-submit">Add to cart &mdash; 
            <span class="quick-price">${qvPrice}</span>
            <div class="loading-overlay__spinner hidden">
              <svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
  `;
  console.log(qvPrice);
  $(".quick-view-container").remove();
  $("body").append(html);
  let selectedVariantPrice = $("[name='qv-variant']:checked").data("price");
  $(".quick-price").text(selectedVariantPrice);
  $(".quick-view-container").fadeIn();
});

$(document).on("click", ".quick-close", function () {
  $(".quick-view-container").fadeOut(() => {
    $(".quick-view-container").remove();
  });
});
$(document).on(
  "change",
  ".recurring-subscribe input[name='subscription_option']",
  function () {
    if ($(this).is(":checked")) {
      $(".onetime-purchase").removeClass("active");
      $(".recurring-subscribe").addClass("active");
      let rec_val = $(".recurring-options-selector").val();
      let dis_type = $(
        ".recurring-options-selector option[value='" + rec_val + "']"
      ).data("dis-type");
      let dis_amount = parseInt(
        $(".recurring-options-selector option[value='" + rec_val + "']").data(
          "dis-amount"
        )
      );
      let calcPrice = getCalcPrice(dis_type, dis_amount);
      $(".quick-price").text(calcPrice);
    }
  }
);
$(document).on(
  "change",
  ".onetime-purchase input[name='subscription_option']",
  function () {
    if ($(this).is(":checked")) {
      $(".recurring-subscribe").removeClass("active");
      $(".onetime-purchase").addClass("active");
      let selectedVariantPrice = $("[name='qv-variant']:checked").data("price");
      $(".quick-price").text(selectedVariantPrice);
    }
  }
);
$(document).on("change", "input[name='qv-variant']", function () {
  if ($(this).is(":checked")) {
    $(".qv-swatch-item").removeClass("active");
    $(this).parent().addClass("active");
    for (i = 0; i <= curProduct.variants.length - 1; i++) {
      let vi = $.trim(curProduct.variants[i].id);
      if (vi === $.trim($(this).val())) {
        selectedVariant = curProduct.variants[i];
      }
    }

    if (
      $(".recurring-subscribe input[name='subscription_option']").is(":checked")
    ) {
      let rec_val = $(".recurring-options-selector").val();
      let dis_type = $(
        ".recurring-options-selector option[value='" + rec_val + "']"
      ).data("dis-type");
      let dis_amount = parseInt(
        $(".recurring-options-selector option[value='" + rec_val + "']").data(
          "dis-amount"
        )
      );
      let calcPrice = getCalcPrice(dis_type, dis_amount);
      $(".quick-price").text(calcPrice);
    } else {
      let selectedVariantPrice = $(this).data("price");
      $(".quick-price").text(selectedVariantPrice);
    }
  }
});

$(document).on("click", ".qv-submit", function () {
  let qty_num = parseInt($("#qty_input").val());
  console.log(qty_num);
  
  if ($("[name='qv-variant']:checked").length > 0) {
    let is_subscribe = false;
    
    if ($(".onetime-purchase input[type='radio']").is(":checked")) {
      is_subscribe = false;
      let data = {
        id: $("[name='qv-variant']:checked").val(),
        quantity: qty_num,
      };
      addToCartQv(is_subscribe, data);
        
    } else if ($(".recurring-subscribe input[type='radio']").is(":checked")) {
      is_subscribe = true;
      let selectedPlan = $(".recurring-options-selector").val();
      let selectedFrequency = $(
        ".recurring-options-selector option[value='" + selectedPlan + "']"
      ).attr("data-plan-option");
      let data = {
        id: $("[name='qv-variant']:checked").val(),
        quantity: qty_num,
        selling_plan: $(".recurring-options-selector").val(),
        properties: {
          "Selling Plan": selectedFrequency,
        },
      };
      addToCartQv(is_subscribe, data);
      
    }
    else {
      is_subscribe = false;
      let data = {
        id: $("[name='qv-variant']:checked").val(),
        quantity: qty_num,
      };
      addToCartQv(is_subscribe, data);
    }
  } else {
      
  }
}); 

function addToCartQv(is_subscribe, data) {
  $(".qv-submit .loading-overlay__spinner").removeClass("hidden");
  jQuery.ajax({
    type: "POST",
    url: "/cart/add.js",
    data: data,
    dataType: "json",
    success: function () {
      console.log("added to the cart");
      $(".quick-action .item-notification").remove();
      $(`<span class="item-notification">Item added to cart. <a href="https://hylands.com/cart" style="text-decoration:underline!important;">View Cart</a></span>`).appendTo(
        ".quick-action"
      );
      $(".qv-submit .loading-overlay__spinner").addClass("hidden");
      setTimeout(function () {
        $(".item-notification").fadeOut(() => {
          $(".item-notification").remove();
        });
      }, 5000);
      //showMiniCart(data.id);
    },
    error: function (data) {
      console.log("QuickView: Something went wrong.");
    },
  });
}
