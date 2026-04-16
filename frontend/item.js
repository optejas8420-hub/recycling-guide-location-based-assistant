document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    if (!itemId) {
        document.getElementById('dynamic-content').innerHTML = '<h2>Item not specified in URL.</h2>';
        return;
    }

    try {
        
        const response = await fetch(`http://localhost:3000/api/materials/${itemId}`);
        
        if (!response.ok) {
            throw new Error('Material not found');
        }

        const data = await response.json();

        //data into the HTML Elements
        document.title = `${data.title} - Recycle Smart`;
        document.getElementById('item-title').textContent = data.title;
        document.getElementById('item-subtitle').textContent = data.subtitle;
        document.getElementById('item-icon').textContent = data.icon;
        
        
        document.getElementById('breadcrumb-current').textContent = data.title;
        document.getElementById('breadcrumb-category').textContent = data.category;

        // Handle Badge
        const badge = document.getElementById('item-badge');
        if (data.recyclable) {
            badge.textContent = '✓ Recyclable';
            badge.className = 'badge recyclable';
        } else {
            badge.textContent = '✕ Not recyclable';
            badge.className = 'badge not-recyclable';
            badge.style.backgroundColor = '#f5f5f5';
            badge.style.color = '#757575';
            badge.style.border = '1px solid #ddd';
        }

    
        document.getElementById('spec-category').textContent = data.category;
        document.getElementById('spec-resin').textContent = data.resinCode;
        document.getElementById('spec-uses').textContent = data.commonUses;

        const stepsContainer = document.getElementById('recycle-steps');
        stepsContainer.innerHTML = ''; 
        data.steps.forEach((step, index) => {
            stepsContainer.innerHTML += `
                <div class="step-item">
                    <span class="step-num">${index + 1}</span>
                    <span>${step}</span>
                </div>
            `;
        });

        // Handle Mistakes List
        const mistakesContainer = document.getElementById('mistake-list');
        mistakesContainer.innerHTML = '';
        data.mistakes.forEach(mistake => {
            mistakesContainer.innerHTML += `
                <li>
                    <span class="red-x">✕</span> 
                    <span>${mistake}</span>
                </li>
            `;
        });

        // Handle FAQs
        const faqContainer = document.getElementById('faq-accordion');
        faqContainer.innerHTML = '';
        data.faqs.forEach(faq => {
            faqContainer.innerHTML += `
                <details class="accordion">
                    <summary>${faq.question}</summary>
                    <p>${faq.answer}</p>
                </details>
            `;
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById('dynamic-content').innerHTML = `
            <div style="text-align:center; padding: 50px;">
                <h2>⚠️ Oops! Material not found.</h2>
                <p>We couldn't find the data for this item.</p>
                <a href="materials.html" class="btn-primary">Back to Materials</a>
            </div>
        `;
    }
});