const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.content-panel');

fetch('data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Could not load data.json (${response.status})`);
    }
    return response.json();
  })
  .then(data => {
    data.products.forEach(item => {
      const panel = document.getElementById(item.category);
      if (!panel || !item.images?.length) return;

      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-image">
          <img src="${item.images[0]}" alt="${item.name}">
        </div>
        <div class="product-name">${item.name}</div>
      `;
      panel.appendChild(card);
    });
  })
  .catch(error => console.error('Unable to display products:', error));

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(currentTab => currentTab.classList.toggle('active', currentTab === tab));
    panels.forEach(panel => panel.classList.toggle('hidden', panel.id !== tab.dataset.tab));
  });
});