function fastads(global) {
  global.googletag = global.googletag || { cmd: [] };

  const observer = new MutationObserver(callback);
  observer.observe(global.document.body, {
    subtree: true,
    childList: true
  });

  // Start DFP on existing nodes
  enableDfp(global.document.querySelectorAll("div[data-dfp]"));

  function callback(mutations) {
    const affectedNodes = [];

    // Ugly ES5 way for compatibility and performance
    for (const { type, addedNodes } of mutations) {
      if (type === "childList") {
        for (const node of addedNodes) {
          if (node.tagName === "DIV" && node.getAttribute("data-dfp")) {
            affectedNodes.push(node);
          }
        }
      }
    }

    enableDfp(affectedNodes);
  }

  function enableDfp(nodes) {
    if (!nodes.length) {
      return;
    }

    googletag.cmd.push(function () {
      const slots = [];

      for (const node of nodes) {
        if (node.id) {
          // Probably already have a dfp widget there
          continue;
        }

        const nodeId = `dfp-ad-${Math.random().toString(36).replace(/[^a-zA-Z0-9]/g, '').substr(0, 7)}`;
        node.id = nodeId;

        const slot = googletag.defineSlot(node.getAttribute("data-dfp"), JSON.parse(node.getAttribute("data-dfp-size")), nodeId);
        slot.addService(googletag.pubads());

        slots.push(slot);
      }

      googletag.pubads().enableLazyLoad({
        fetchMarginPercent: 500,  // Fetch slots within 5 viewports.
        renderMarginPercent: 200,  // Render slots within 2 viewports.
        mobileScaling: 2.0  // Double the above values on mobile.
      });
      googletag.enableServices();

      for (const slot of slots) {
        googletag.display(slot);
      }
    })
  }
}

// Keep this here, this gets removed during build
module.exports = fastads;
