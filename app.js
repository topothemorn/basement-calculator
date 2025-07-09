// Application data with default values
const DEFAULT_DATA = {
  framing_materials: [
    { name: "Regular 2x4 studs (8-foot)", default_quantity: 35, default_unit_price: 3.50, unit: "pieces" },
    { name: "Regular 2x4 top plates (8-foot)", default_quantity: 10, default_unit_price: 3.50, unit: "pieces" },
    { name: "Pressure-treated 2x4 bottom plates (8-foot)", default_quantity: 5, default_unit_price: 5.00, unit: "pieces" },
    { name: "Framing nails (3.5 inch)", default_quantity: 50, default_unit_price: 0.50, unit: "lbs" },
    { name: "Tapcon concrete screws (3/16\")", default_quantity: 50, default_unit_price: 0.40, unit: "pieces" },
    { name: "Miscellaneous framing supplies", default_quantity: 1, default_unit_price: 20.00, unit: "lot" }
  ],
  drywall_materials: [
    { name: "Drywall sheets (1/2\" standard)", default_quantity: 10, default_unit_price: 15.00, unit: "sheets" },
    { name: "Drywall screws (#6 x 1-1/4\")", default_quantity: 3, default_unit_price: 7.50, unit: "lbs" },
    { name: "Joint compound (ready-mix 3.5 gal)", default_quantity: 1, default_unit_price: 18.00, unit: "bucket" },
    { name: "Drywall tape (paper, 250 ft)", default_quantity: 1, default_unit_price: 12.00, unit: "roll" },
    { name: "Primer (for finished drywall)", default_quantity: 1, default_unit_price: 25.00, unit: "gallon" }
  ],
  framing_tools: [
    { name: "Safety glasses", default_price: 8.00, description: "Basic protection" },
    { name: "Hearing protection", default_price: 12.00, description: "Foam ear plugs" },
    { name: "Work gloves", default_price: 8.00, description: "Basic work gloves" },
    { name: "Tape measure (25-foot)", default_price: 12.00, description: "Basic measuring tape" },
    { name: "Level (2-foot)", default_price: 20.00, description: "Johnson Level basic" },
    { name: "Level (6-foot)", default_price: 30.00, description: "Johnson Level basic" },
    { name: "Chalk line reel", default_price: 20.00, description: "Basic chalk line" },
    { name: "Speed square", default_price: 12.00, description: "Basic Swanson speed square" },
    { name: "Pencil/marker", default_price: 3.00, description: "Basic pencil" },
    { name: "Framing hammer", default_price: 25.00, description: "Hart Tools framing hammer" },
    { name: "Utility knife", default_price: 8.00, description: "Basic utility knife" },
    { name: "Hammer drill (corded)", default_price: 50.00, description: "Harbor Freight hammer drill" },
    { name: "Masonry drill bit (3/16\")", default_price: 5.00, description: "Basic masonry bit" },
    { name: "Pneumatic framing nailer", default_price: 80.00, description: "Harbor Freight pneumatic nailer" },
    { name: "6-gallon air compressor", default_price: 149.00, description: "Harbor Freight 6-gallon pancake" }
  ],
  drywall_tools: [
    { name: "Drywall T-square (48\")", default_price: 35.00, description: "Measuring and cutting drywall sheets" },
    { name: "Drywall knife set (4\", 6\", 12\")", default_price: 35.00, description: "Applying joint compound and taping" },
    { name: "Utility knife", default_price: 8.00, description: "Scoring and cutting drywall" },
    { name: "Drywall saw/jab saw", default_price: 12.00, description: "Cutting holes and openings" },
    { name: "Mud pan", default_price: 15.00, description: "Holding joint compound while working" },
    { name: "Drywall pole sander", default_price: 25.00, description: "Sanding joints and walls" },
    { name: "Sanding screens/paper", default_price: 20.00, description: "Smoothing dried joint compound" },
    { name: "Drop cloths", default_price: 15.00, description: "Protecting floors and furniture" },
    { name: "Dust masks", default_price: 15.00, description: "Protecting lungs from dust" },
    { name: "Corner knife (inside)", default_price: 18.00, description: "Finishing inside corners" },
    { name: "Drywall screw gun attachment", default_price: 25.00, description: "Faster screw installation" }
  ],
  professional_cost_range: { min: 1835, max: 3429 }
};

// Current application state
let currentData = JSON.parse(JSON.stringify(DEFAULT_DATA)); // Deep copy of default data
let selectedTools = new Set();

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing application...');
  initializeMaterials();
  initializeTools();
  updateAllTotals();
});

// Initialize materials sections
function initializeMaterials() {
  console.log('Initializing materials...');
  renderMaterials('framing', currentData.framing_materials);
  renderMaterials('drywall', currentData.drywall_materials);
}

// Render materials for a specific category
function renderMaterials(category, materials) {
  const container = document.getElementById(`${category}Materials`);
  if (!container) {
    console.error(`Container not found: ${category}Materials`);
    return;
  }
  
  container.innerHTML = '';
  
  materials.forEach((material, index) => {
    const itemId = `${category}_${index}`;
    
    const materialElement = document.createElement('div');
    materialElement.className = 'material-item';
    materialElement.innerHTML = `
      <div class="material-name">
        ${material.name}
        <div class="material-unit">(${material.unit})</div>
      </div>
      <div>
        <input 
          type="number" 
          class="quantity-input" 
          id="${itemId}_qty" 
          value="${material.default_quantity}" 
          min="0" 
          step="1"
        >
      </div>
      <div>
        <input 
          type="number" 
          class="price-input" 
          id="${itemId}_price" 
          value="${material.default_unit_price.toFixed(2)}" 
          min="0" 
          step="0.01"
        >
      </div>
      <div class="item-total" id="${itemId}_total">$${(material.default_quantity * material.default_unit_price).toFixed(2)}</div>
    `;
    
    container.appendChild(materialElement);
    
    // Add event listeners after element is in DOM
    setTimeout(() => {
      const qtyInput = document.getElementById(`${itemId}_qty`);
      const priceInput = document.getElementById(`${itemId}_price`);
      
      if (qtyInput) {
        qtyInput.addEventListener('input', function(e) {
          console.log(`Quantity changed for ${itemId}: ${e.target.value}`);
          updateMaterialCalculation(category, index);
        });
        qtyInput.addEventListener('change', function(e) {
          console.log(`Quantity changed (change event) for ${itemId}: ${e.target.value}`);
          updateMaterialCalculation(category, index);
        });
      }
      
      if (priceInput) {
        priceInput.addEventListener('input', function(e) {
          console.log(`Price changed for ${itemId}: ${e.target.value}`);
          updateMaterialCalculation(category, index);
        });
        priceInput.addEventListener('change', function(e) {
          console.log(`Price changed (change event) for ${itemId}: ${e.target.value}`);
          updateMaterialCalculation(category, index);
        });
      }
    }, 10);
  });
}

// Initialize tools sections
function initializeTools() {
  console.log('Initializing tools...');
  renderTools('framing', currentData.framing_tools);
  renderTools('drywall', currentData.drywall_tools);
}

// Render tools for a specific category
function renderTools(category, tools) {
  const container = document.getElementById(`${category}Tools`);
  if (!container) {
    console.error(`Container not found: ${category}Tools`);
    return;
  }
  
  container.innerHTML = '';
  
  tools.forEach((tool, index) => {
    const toolId = `${category}_tool_${index}`;
    
    const toolElement = document.createElement('div');
    toolElement.className = 'tool-item';
    toolElement.innerHTML = `
      <input 
        type="checkbox" 
        class="tool-checkbox" 
        id="${toolId}"
      >
      <div class="tool-info">
        <div class="tool-name">${tool.name}</div>
        <div class="tool-description">${tool.description}</div>
        <div class="tool-price-container">
          <span>$</span>
          <input 
            type="number" 
            class="tool-price-input" 
            id="${toolId}_price" 
            value="${tool.default_price.toFixed(2)}" 
            min="0" 
            step="0.01"
          >
        </div>
      </div>
    `;
    
    container.appendChild(toolElement);
    
    // Add event listeners after element is in DOM
    setTimeout(() => {
      const checkbox = document.getElementById(toolId);
      const priceInput = document.getElementById(`${toolId}_price`);
      
      if (checkbox) {
        checkbox.addEventListener('change', function(e) {
          console.log(`Tool ${toolId} ${e.target.checked ? 'selected' : 'deselected'}`);
          updateToolSelection(toolId, e.target.checked);
        });
      }
      
      if (priceInput) {
        priceInput.addEventListener('input', function(e) {
          console.log(`Tool price changed for ${toolId}: ${e.target.value}`);
          updateToolPrice(category, index);
        });
        priceInput.addEventListener('change', function(e) {
          console.log(`Tool price changed (change event) for ${toolId}: ${e.target.value}`);
          updateToolPrice(category, index);
        });
      }
    }, 10);
  });
}

// Update material calculation when quantity or price changes
function updateMaterialCalculation(category, index) {
  const itemId = `${category}_${index}`;
  const quantityInput = document.getElementById(`${itemId}_qty`);
  const priceInput = document.getElementById(`${itemId}_price`);
  const totalElement = document.getElementById(`${itemId}_total`);
  
  if (!quantityInput || !priceInput || !totalElement) {
    console.error(`Missing elements for ${itemId}`);
    return;
  }
  
  const quantity = parseInt(quantityInput.value) || 0;
  const price = parseFloat(priceInput.value) || 0;
  const total = quantity * price;
  
  // Update current data
  currentData[`${category}_materials`][index].default_quantity = quantity;
  currentData[`${category}_materials`][index].default_unit_price = price;
  
  totalElement.textContent = `$${total.toFixed(2)}`;
  updateAllTotals();
}

// Update tool selection
function updateToolSelection(toolId, isSelected) {
  const toolElement = document.getElementById(toolId);
  if (!toolElement) {
    console.error(`Tool element not found: ${toolId}`);
    return;
  }
  
  const toolContainer = toolElement.parentElement;
  
  if (isSelected) {
    selectedTools.add(toolId);
    toolContainer.classList.add('selected');
  } else {
    selectedTools.delete(toolId);
    toolContainer.classList.remove('selected');
  }
  
  updateAllTotals();
}

// Update tool price
function updateToolPrice(category, index) {
  const toolId = `${category}_tool_${index}`;
  const priceInput = document.getElementById(`${toolId}_price`);
  
  if (!priceInput) {
    console.error(`Price input not found: ${toolId}_price`);
    return;
  }
  
  const price = parseFloat(priceInput.value) || 0;
  
  // Update current data
  currentData[`${category}_tools`][index].default_price = price;
  
  // Update totals if tool is selected
  if (selectedTools.has(toolId)) {
    updateAllTotals();
  }
}

// Update all totals
function updateAllTotals() {
  const framingMaterialsTotal = calculateMaterialsTotal('framing');
  const drywallMaterialsTotal = calculateMaterialsTotal('drywall');
  const framingToolsTotal = calculateToolsTotal('framing');
  const drywallToolsTotal = calculateToolsTotal('drywall');
  
  // Update subtotals
  const framingSubtotal = document.getElementById('framingSubtotal');
  const drywallSubtotal = document.getElementById('drywallSubtotal');
  const framingToolsSubtotal = document.getElementById('framingToolsSubtotal');
  const drywallToolsSubtotal = document.getElementById('drywallToolsSubtotal');
  
  if (framingSubtotal) framingSubtotal.textContent = framingMaterialsTotal.toFixed(2);
  if (drywallSubtotal) drywallSubtotal.textContent = drywallMaterialsTotal.toFixed(2);
  if (framingToolsSubtotal) framingToolsSubtotal.textContent = framingToolsTotal.toFixed(2);
  if (drywallToolsSubtotal) drywallToolsSubtotal.textContent = drywallToolsTotal.toFixed(2);
  
  // Update summary
  const summaryElements = {
    'summaryFramingMaterials': framingMaterialsTotal,
    'summaryDrywallMaterials': drywallMaterialsTotal,
    'summaryFramingTools': framingToolsTotal,
    'summaryDrywallTools': drywallToolsTotal
  };
  
  Object.entries(summaryElements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value.toFixed(2);
  });
  
  const grandTotal = framingMaterialsTotal + drywallMaterialsTotal + framingToolsTotal + drywallToolsTotal;
  const summaryTotal = document.getElementById('summaryTotal');
  const diyTotal = document.getElementById('diyTotal');
  
  if (summaryTotal) summaryTotal.textContent = grandTotal.toFixed(2);
  if (diyTotal) diyTotal.textContent = grandTotal.toFixed(2);
  
  // Update savings
  const savingsLow = Math.max(0, DEFAULT_DATA.professional_cost_range.min - grandTotal);
  const savingsHigh = Math.max(0, DEFAULT_DATA.professional_cost_range.max - grandTotal);
  
  const savingsLowElement = document.getElementById('savingsLow');
  const savingsHighElement = document.getElementById('savingsHigh');
  
  if (savingsLowElement) savingsLowElement.textContent = savingsLow.toFixed(2);
  if (savingsHighElement) savingsHighElement.textContent = savingsHigh.toFixed(2);
}

// Calculate materials total for a category
function calculateMaterialsTotal(category) {
  let total = 0;
  currentData[`${category}_materials`].forEach((material, index) => {
    const itemId = `${category}_${index}`;
    const quantityInput = document.getElementById(`${itemId}_qty`);
    const priceInput = document.getElementById(`${itemId}_price`);
    
    if (quantityInput && priceInput) {
      const quantity = parseInt(quantityInput.value) || 0;
      const price = parseFloat(priceInput.value) || 0;
      total += quantity * price;
    }
  });
  return total;
}

// Calculate tools total for a category
function calculateToolsTotal(category) {
  let total = 0;
  currentData[`${category}_tools`].forEach((tool, index) => {
    const toolId = `${category}_tool_${index}`;
    const priceInput = document.getElementById(`${toolId}_price`);
    
    if (selectedTools.has(toolId) && priceInput) {
      const price = parseFloat(priceInput.value) || 0;
      total += price;
    }
  });
  return total;
}

// Reset to default values
function resetToDefaults() {
  if (confirm('Are you sure you want to reset all quantities and prices to their default values?')) {
    console.log('Resetting to defaults...');
    
    // Reset current data to default
    currentData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    
    // Clear selected tools
    selectedTools.clear();
    
    // Re-render everything
    initializeMaterials();
    initializeTools();
    updateAllTotals();
    
    console.log('Reset complete');
  }
}

// Format currency for display
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}