const optimizelySdk = require('@optimizely/optimizely-sdk');
const MODE = process.env.MODE;

const optimizelyClient = (async () => {
  const response = await fetch(`https://cdn.optimizely.com/datafiles/${process.env.OPTIMIZELY_SDK}.json`);
  const datafile = await response.json();
  return optimizelySdk.createInstance({ datafile });
})();

export const checkHasFeature = async (feature: string) => {
  const isActive = (await optimizelyClient)
    .isFeatureEnabled(feature, `${Math.random()}`);

  return {
    feature,
    isActive,
    mode: MODE
  };
};
