function init_algolia(appId, searchKey, indexName) {
    
    const { algoliasearch, instantsearch, searchInstance } = window;
    if (searchInstance) {
        searchInstance.dispose();
    }
    
    const searchClient = algoliasearch(appId, searchKey);
    const search = instantsearch({
        indexName: indexName,
        routing: true,
        searchClient,
    });
    // If Algolia runs into an error, it's most likely an issue with AppId/SearchKey/IndexName. Redirect back to setup
    search.addListener('error', function () { 
        showSetup('Algolia failed to initialize, parameters are not configured correctly.')
    })
    // store search instance, so we can dispose in case we re-init algolia
    window.searchInstance = search;
    // https://www.algolia.com/doc/api-reference/widgets/infinite-hits/js/
    const renderInfiniteHits = (renderOptions) => {
        // this function is called every time the search results change
        // if this is an initial render and we got no results object, skip
        if (!renderOptions.results) {
            return;
        }
        // get the reference for the Result Count elements on the UI (its text and link as well)
        const resultCountElement = document.getElementById('result-count');
        const textEl = resultCountElement.querySelector('span');
        const linkEl = resultCountElement.querySelector('a');
        // check if we have any results
        const hasHits = renderOptions.results.nbHits !== 0;
        // check if we have any search query
        const hasQuery = !!renderOptions.results.query;
        // check if we have any geo bounding box (query made on map)
        const hasGeoQuery = !!renderOptions.results._state.insideBoundingBox;

        // We show/hide result Details depending if we have results or not
        document.getElementById('details-display').style.display = hasHits ? 'block' : 'none';
        // We hide the Map display if we have no results AND there was no map query applied (so the query can be undone)
        document.getElementById('map-display').style.display = hasHits || hasGeoQuery ? 'block' : 'none';
        // Update the Result count container to display information about results
        if (hasHits) {
            // if there are any results
            if (renderOptions.isLastPage) {
                // if we are on last page, show text and a link to clear filters
                textEl.innerText = `Showing all ${renderOptions.hits.length} results`;
                linkEl.style.display = 'none';
                linkEl.innerText = 'Clear all filters';
                linkEl.href = '.';
                linkEl.style.display = 'inline';
                linkEl.onclick = null;
            } else {
                // if we are not on last page, show text and link to load more items
                textEl.innerText = `Showing top ${renderOptions.hits.length} results of ${renderOptions.results.nbHits}`;
                linkEl.href = '';
                linkEl.innerText = 'Load more';
                linkEl.style.display = 'inline';
                linkEl.href = "#";
                linkEl.onclick = () => {
                    renderOptions.showMore();
                    return false;
                };
            }
        } else {
            // if we have no results, construct message
            let statusMessage = 'No results have been found';
            if (hasQuery) {
                statusMessage += ` for '${renderOptions.results.query}'`;
            }
            if (hasGeoQuery) {
                statusMessage += ' in selected map area';
            }
            // show message and link to clear filters
            textEl.innerText = statusMessage
            linkEl.innerText = 'Clear all filters';
            linkEl.href = '.';
            linkEl.style.display = 'inline';
            linkEl.onclick = null;
        }
    }

    const customInfiniteHits = instantsearch.connectors.connectInfiniteHits(
        renderInfiniteHits
    );

    search.addWidgets([
        instantsearch.widgets.searchBox({
            container: '#searchbox',
            placeholder: 'Search real-estate listings',
            autofocus: true
        }),
        instantsearch.widgets.infiniteHits({
            container: '#hits',
            templates: {
                empty: `<div>
      <p>No results have been found for {{ query }}</p>
      <a role="button" href=".">Clear all filters</a>
    </div>`,
                item: `
<article id="hit-{{objectID}}">
  
  <div class="name-container">
    <h1 class="name">{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}</h1>
    {{#scores}}
    <div class="stars">
      <svg aria-hidden="true"> 
      {{#scores.has_one}}
        <use xlink:href="#ais-RatingMenu-starSymbol"></use>
      {{/scores.has_one}}
      {{^scores.has_one}}
        <use xlink:href="#ais-RatingMenu-starEmptySymbol"></use>
      {{/scores.has_one}}
       </svg>
       <svg aria-hidden="true"> 
      {{#scores.has_two}}
        <use xlink:href="#ais-RatingMenu-starSymbol"></use>
      {{/scores.has_two}}
      {{^scores.has_two}}
        <use xlink:href="#ais-RatingMenu-starEmptySymbol"></use>
      {{/scores.has_two}}
       </svg>
       <svg aria-hidden="true"> 
       {{#scores.has_three}}
         <use xlink:href="#ais-RatingMenu-starSymbol"></use>
       {{/scores.has_three}}
       {{^scores.has_three}}
         <use xlink:href="#ais-RatingMenu-starEmptySymbol"></use>
       {{/scores.has_three}}
        </svg>
        <svg aria-hidden="true"> 
        {{#scores.has_four}}
          <use xlink:href="#ais-RatingMenu-starSymbol"></use>
        {{/scores.has_four}}
        {{^scores.has_four}}
          <use xlink:href="#ais-RatingMenu-starEmptySymbol"></use>
        {{/scores.has_four}}
         </svg>
         <svg aria-hidden="true"> 
         {{#scores.has_five}}
           <use xlink:href="#ais-RatingMenu-starSymbol"></use>
         {{/scores.has_five}}
         {{^scores.has_five}}
           <use xlink:href="#ais-RatingMenu-starEmptySymbol"></use>
         {{/scores.has_five}}
          </svg>
    </div>
    {{/scores}}
  </div>
  {{#description}}
  <div class="description">
      <div class="title">Description{{}}</div>
      <p class="desc">{{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}</p>
  </div>
  {{/description}}
  {{#summary}}
  <div class="summary">
      <div class="title">Summary</div>
      <p class="desc">{{#helpers.highlight}}{ "attribute": "summary" }{{/helpers.highlight}}</p>
  </div>
  {{/summary}}
  {{#space}}
  <div class="space">
      <div class="title">Space</div>
      <p class="desc">{{#helpers.highlight}}{ "attribute": "space" }{{/helpers.highlight}}</p>
  </div>
  {{/space}}
  {{#neighborhood}}
  <div class="neigh">
      <div class="title">Neighborhood</div>
      <p class="desc">{{#helpers.highlight}}{ "attribute": "neighborhood_overview" }{{/helpers.highlight}}</p>
  </div>
  {{/neighborhood}}
  {{#transit}}
  <div class="transit">
      <div class="title">Transit</div>
      <p class="desc">{{#helpers.highlight}}{ "attribute": "transit" }{{/helpers.highlight}}</p>
  </div>
  {{/transit}}
 
  <div class="info">
    {{#property_type}}
        <div>
            <span class="title">Property Type:</span>
            <span>{{property_type}}</span>
        </div>
    {{/property_type}}
    {{#address}}
      <div>
        <span class="title">Address:</span>
        <span>{{address.street}}</span>
      </div>
      {{/address}}
      {{#price}}
      <div>
        <span class="title">Price:</span>
        <b>{{price}}$ per night</b>
        {{#cleaning_fee}}
        <span> + {{cleaning_fee}}$ cleaning fee</span>
        {{/cleaning_fee}}
        {{#security_deposit}}
        <span> + {{security_deposit}}$ security deposit</span>
        {{/security_deposit}}
      </div>
      {{/price}}
      {{#accommodates}}
      <div>
        <span class="title">Accommodates:</span>
        <b>{{accommodates}} people</b>
        {{#bedrooms}}
        <span> in {{bedrooms}} bedroom(s)</span>
        {{/bedrooms}}
        {{#beds}}
        <span>, {{beds}} bed(s)</span>
        {{/beds}}
        {{#bathrooms}}
        <span> with {{bathrooms}} bathroom(s)</span>
        {{/bathrooms}}
       </div>
      {{/accommodates}}
  </div>
 
  {{#images.picture_url}}
  <img class="image" src="{{images.picture_url}}">
  {{/images.picture_url}}
</article>
`,
            },
        }),
        instantsearch.widgets.configure({
            hitsPerPage: 8,
        }),
        instantsearch.widgets.hitsPerPage({
            container: '#hits-count',
            items: [
                { label: 'Load 5 results per page', value: 5 },
                { label: 'Load 10 results per page', value: 10 },
                { label: 'Load 20 results per page', value: 20 },
                { label: 'Load 50 results per page', value: 50, default: true },
                { label: 'Load 100 results per page', value: 100 },
                { label: 'Load 200 results per page', value: 200 }

            ]
        }),
        // instantsearch.widgets.pagination({
        //   container: '#pagination',
        // }),
        instantsearch.widgets.clearRefinements({
            container: '#clear-refinements',
            templates: {
                resetLabel: 'Clear filters',
            },
        }),
        instantsearch.widgets.refinementList({
            container: '#property-list',
            attribute: 'property_type'
        }),
        instantsearch.widgets.refinementList({
            container: '#country-list',
            attribute: 'address.country'
        }),
        // https://www.algolia.com/doc/api-reference/widgets/numeric-menu/js/
        // instantsearch.widgets.numericMenu({
        //   container: '#review-scores',
        //   attribute: 'review_score',
        //   items: [
        //     { label: 'All'},
        //     { label: 'Very high (> 9)', start: 90 },
        //     { label: 'High (7.5 - 9)', start: 75, end: 90},
        //     { label: 'Medium (4 - 7.5)', start: 40, end: 75},
        //     { label: 'Low (< 4)', end: 40 }
        //   ]
        // })
        instantsearch.widgets.ratingMenu({
            container: '#review-scores',
            attribute: 'scores.stars'
        }),
        // https://www.algolia.com/doc/api-reference/widgets/range-slider/js/
        instantsearch.widgets.rangeSlider({
            container: '#price',
            attribute: 'price',
            precision: 10
        }),
        instantsearch.widgets.rangeSlider({
            container: '#cleaning-fee',
            attribute: 'cleaning_fee',
            precision: 5
        }),
        // https://www.algolia.com/doc/api-reference/widgets/geo-search/js/
        instantsearch.widgets.geoSearch({
            container: '#geo-search',
            googleReference: window.google,
            HTMLMarker: 'asd',
            initialPosition: {
                lat: 48.864716,
                lng: 2.349014,
            },
            initialZoom: 10,
            builtInMarker: {
                createOptions(item) {
                    return {
                        title: item.name,
                    };
                },
                events: {
                    click({ event, item, marker, map }) {
                        document.getElementById('hit-' + item.objectID).scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                        // console.log(item, marker);
                    },
                },
            },
        }),

        customInfiniteHits({

        })

    ]);

    search.start();

}