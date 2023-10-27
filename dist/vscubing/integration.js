const api = (function () {
  function regSolvesListener(callback) {
    kernel.regListener("api", "time", (_, time) => {
      const dnf = time[2][0] === -1;
      if (dnf) {
        callback({ dnf: true });
        return;
      }

      const csReconstruction = time[4][0];
      const algCubingReconstruction = csReconstruction.replace(
        /@(\d+)/g,
        "/*$1*/",
      );

      callback({
        reconstruction: algCubingReconstruction,
        timeMs: time[2][1],
      });
    });
  }

  function importScramble(str) {
    kernel.hideDialog();
    window._clearSession();

    window._resetTimer();
    window._scrambleVirtual(str);
    window.focus();
  }

  function hackForFreshLocalStorage() {
    localStorage.setItem(
      "properties",
      `{\"sessionData\":\"{\\\"1\\\":{\\\"name\\\":1,\\\"opt\\\":{},\\\"rank\\\":1,\\\"stat\\\":[0,0,-1],\\\"date\\\":[null,null]},\\\"2\\\":{\\\"name\\\":2,\\\"opt\\\":{},\\\"rank\\\":2},\\\"3\\\":{\\\"name\\\":3,\\\"opt\\\":{},\\\"rank\\\":3},\\\"4\\\":{\\\"name\\\":4,\\\"opt\\\":{},\\\"rank\\\":4},\\\"5\\\":{\\\"name\\\":5,\\\"opt\\\":{},\\\"rank\\\":5},\\\"6\\\":{\\\"name\\\":6,\\\"opt\\\":{},\\\"rank\\\":6},\\\"7\\\":{\\\"name\\\":7,\\\"opt\\\":{},\\\"rank\\\":7},\\\"8\\\":{\\\"name\\\":8,\\\"opt\\\":{},\\\"rank\\\":8},\\\"9\\\":{\\\"name\\\":9,\\\"opt\\\":{},\\\"rank\\\":9},\\\"10\\\":{\\\"name\\\":10,\\\"opt\\\":{},\\\"rank\\\":10},\\\"11\\\":{\\\"name\\\":11,\\\"opt\\\":{},\\\"rank\\\":11},\\\"12\\\":{\\\"name\\\":12,\\\"opt\\\":{},\\\"rank\\\":12},\\\"13\\\":{\\\"name\\\":13,\\\"opt\\\":{},\\\"rank\\\":13},\\\"14\\\":{\\\"name\\\":14,\\\"opt\\\":{},\\\"rank\\\":14},\\\"15\\\":{\\\"name\\\":15,\\\"opt\\\":{},\\\"rank\\\":15}}\",\"input\":\"v\"}`,
    );
    localStorage.removeItem("cachedScr");
  }

  function setInputModeToVirtual() {
    window.kernel.setProp("input", "v");
  }

  return {
    setInputModeToVirtual,
    hackForFreshLocalStorage,
    regSolvesListener,
    importScramble,
  };
})();
const POST_MESSAGE_SOURCE = "vs-solver-integration";

api.hackForFreshLocalStorage();
window.addEventListener("load", () => {
  api.setInputModeToVirtual();
});

api.regSolvesListener((result) => {
  parent.postMessage({ source: POST_MESSAGE_SOURCE, payload: result }, "*");
});

window.addEventListener(
  "message",
  (event) => {
    const { source, scramble } = event.data;
    if (source !== POST_MESSAGE_SOURCE) {
      return;
    }

    api.importScramble(scramble);
  },
  false,
);
