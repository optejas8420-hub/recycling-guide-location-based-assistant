document.addEventListener('DOMContentLoaded', async () => {
    //  Get the guide ID/slug from the URL 
    const urlParams = new URLSearchParams(window.location.search);
    const guideId = urlParams.get('id');

    const contentContainer = document.getElementById('guide-content');

    if (!guideId) {
        contentContainer.innerHTML = '<p>No guide specified. Please return to the guides page.</p>';
        return;
    }

    try {
        //  Fetch data from your Express backend
        const response = await fetch(`/api/guides/${guideId}`);
        
        if (!response.ok) {
            throw new Error('Guide not found');
        }

        const data = await response.json();

        //  Update the Page Title & Meta
        document.title = `${data.title} - Recycle Smart`;
        
        //  Inject the Core Data
        document.getElementById('guide-title').textContent = data.title;
        document.getElementById('guide-category').textContent = data.category;
        document.getElementById('guide-read-time').textContent = `⏳ ${data.read_time} min read`;
        
        const descElement = document.getElementById('guide-description');
        if (descElement) descElement.textContent = data.description || '';

        const dateElement = document.getElementById('guide-date');
        if (dateElement) dateElement.textContent = data.publish_date || '';
        
        // Handle the Hero section 
        if (data.hero_emoji) {
            document.getElementById('guide-hero-img').innerHTML = data.hero_emoji;
        } else if (data.hero_image_url) {
            document.getElementById('guide-hero-img').innerHTML = `<img src="${data.hero_image_url}" alt="${data.title}">`;
        }

        // Inject the HTML content block 
        contentContainer.innerHTML = data.html_content;

        // Inject Tags
        const tagsContainer = document.getElementById('guide-tags');
        if (tagsContainer) {
            tagsContainer.innerHTML = ''; // clear loading state
            if (data.tags && data.tags.length > 0) {
                data.tags.forEach(tag => {
                    const span = document.createElement('span');
                    span.className = 'tag';
                    span.textContent = tag;
                    tagsContainer.appendChild(span);
                });
            }
        }

        //  Inject Dynamic Eco Facts
        const factsContainer = document.getElementById('guide-eco-facts');
        if (factsContainer) {
            factsContainer.innerHTML = ''; // clear loading skeleton
            if (data.eco_facts && data.eco_facts.length > 0) {
                data.eco_facts.forEach(fact => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span class="fact-icon">${fact.icon}</span> <span>${fact.text}</span>`;
                    factsContainer.appendChild(li);
                });
            } else {
                // Fallback if no specific facts exist
                factsContainer.innerHTML = '<li><span class="fact-icon">🌍</span> <span>Every little bit helps to save our planet!</span></li>';
            }
        }

    } catch (error) {
        console.error('Error fetching guide:', error);
        contentContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 0;">
                <h3>Oops! We couldn't load this guide.</h3>
                <p>It might have been moved or doesn't exist.</p>
                <a href="recycling-guide.html" style="color: #2c7a3f; font-weight: bold;">Return to Guides</a>
            </div>
        `;
    }
});