// Over optimizations that no one asked for
const ATTRIBUTE = 'data-dfp';
const parse = JSON.parse;

function fastads(global) {
  global.googletag = global.googletag || { cmd: [] };
  const document = global.document;

  const observer = new MutationObserver(mutationCallback);
  observer.observe(document.body, {
    subtree: true,
    childList: true
  });

  // Start DFP on existing nodes
  enableDfp(document.querySelectorAll(`div[${ATTRIBUTE}]`));
}

function mutationCallback(mutations) {
  const affectedNodes = [];

  // Ugly ES5 way for compatibility and performance
  for (const { type, addedNodes } of mutations) {
    if (type === "childList") {
      pushAddedNodesToList(affectedNodes, addedNodes);
    }
  }

  enableDfp(affectedNodes);
}

function pushAddedNodesToList(affectedNodes, nodeList) {
  for (const node of nodeList) {
    if (node.tagName === "DIV" && node.getAttribute(ATTRIBUTE)) {
      affectedNodes.push(node);
    } else if(node.childNodes.length) {
      pushAddedNodesToList(affectedNodes, node.childNodes);
    }
  }
}

function enableDfp(nodes) {
  if (!nodes.length) {
    return;
  }

  global.googletag.cmd.push(function () {
    const googletag = global.googletag;
    const slots = [];

    for (const node of nodes) {
      if (node.id) {
        // Probably already have a dfp widget there
        continue;
      }

      const nodeId = `dfp-ad-${Math.random().toString(36).replace(/[^a-zA-Z0-9]/g, '').substr(0, 7)}`;
      node.id = nodeId;

      try {
        slots.push(buildSlot(googletag, node, nodeId));
      } catch (e) {
        console.error(`FastAds: Error while building slot ${nodeId}`);
        console.error(e);
      }
    }

    const config = global.FASTAD_CONFIG || {};

    if(config.disableLazy) {
      googletag.enableSingleRequest();
    } else {
      googletag.pubads().enableLazyLoad({
        fetchMarginPercent: config.fetchMarginPercent || 500,
        renderMarginPercent: config.renderMarginPercent || 200,
        mobileScaling: config.mobileScaling || 2
      });
    }
    googletag.enableServices();

    for (const slot of slots) {
      googletag.display(slot);
    }
  })
}

function buildSlot(googletag, node, nodeId) {
  let slot = googletag.defineSlot(node.getAttribute(ATTRIBUTE), parse(node.getAttribute(`${ATTRIBUTE}-size`)), nodeId);

  const service = googletag.pubads();
  const targeting = node.getAttribute(`${ATTRIBUTE}-targeting`);
  if(targeting) {
    for(const [key, value] of parse(targeting)) {
      service.setTargeting(key, value)
    }
  }

  slot = slot.addService(service);

  const sizeMapping = node.getAttribute(`${ATTRIBUTE}-sizemapping`);
  if (sizeMapping) {
    slot = slot.defineSizeMapping(parse(sizeMapping));
  }

  const collapse = node.getAttribute(`${ATTRIBUTE}-collapse`);
  if(collapse) {
    slot = slot.setCollapseEmptyDiv(parse(collapse));
  }

  return slot;
}

// Keep this here, this gets removed during build
module.exports = fastads;
