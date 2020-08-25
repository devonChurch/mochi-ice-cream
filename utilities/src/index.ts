const MODE = process.env.MODE;

export const checkHasFeature = (feature: string) => new Promise((resolve) => setTimeout(() => {
  console.log(`Checking for feature: ${feature}`);

  resolve({
    feature,
    isActive: true,
    mode: MODE
  });
}, 3000));
