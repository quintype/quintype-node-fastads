function fastads(global) {
  global.googletag = global.googletag || { cmd: [] };

  const observer = new MutationObserver(mutationCallback);
  observer.observe(global.document.body, {
    subtree: true,
    childList: true
  });

  // Start DFP on existing nodes
  enableDfp(global.document.querySelectorAll("div[data-dfp]"));
}

function mutationCallback(mutations) {
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

  global.googletag.cmd.push(function () {
    const slots = [];

    for (const node of nodes) {
      if (node.id) {
        // Probably already have a dfp widget there
        continue;
      }

      const nodeId = `dfp-ad-${Math.random().toString(36).replace(/[^a-zA-Z0-9]/g, '').substr(0, 7)}`;
      node.id = nodeId;

      try {
        slots.push(buildSlot(node, nodeId));
      } catch (e) {
        console.error(`FastAds: Error while building slot ${nodeId}`);
        console.error(e);
      }
    }

    const {
      fetchMarginPercent = 500,
      renderMarginPercent = 200,
      mobileScaling = 2.0,
      disableLazy = false
    } = global.FASTAD_CONFIG || {};

    if(disableLazy) {
      global.googletag.enableSingleRequest();
    } else {
      global.googletag.pubads().enableLazyLoad({
        fetchMarginPercent,
        renderMarginPercent,
        mobileScaling
      });
    }
    global.googletag.enableServices();

    for (const slot of slots) {
      global.googletag.display(slot);
    }
  })
}

function buildSlot(node, nodeId) {
  let slot = global.googletag.defineSlot(node.getAttribute("data-dfp"), JSON.parse(node.getAttribute("data-dfp-size")), nodeId);

  slot = slot.addService(global.googletag.pubads());

  const sizeMapping = node.getAttribute("data-dfp-sizemapping");
  if (sizeMapping) {
    slot = slot.defineSizeMapping(JSON.parse(sizeMapping));
  }

  return slot;
}

// Keep this here, this gets removed during build
module.exports = fastads;
