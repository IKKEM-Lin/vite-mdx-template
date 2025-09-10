/* eslint-disable @typescript-eslint/no-explicit-any */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getRDKit = async () =>
  window.initRDKitModule &&
  (await window.initRDKitModule().catch(() => Promise.resolve(null)));

// let timer: any;
export const rdkInit: () => any = async () => {
  console.log("waiting for RDKit...");
  if ((window as any).RDKit) {
    return (window as any).RDKit;
  }
  const RDKit = await getRDKit();
  if (RDKit) {
    (window as any).RDKit = RDKit;
    return RDKit;
  }
  await sleep(500);
  return await rdkInit();
};
