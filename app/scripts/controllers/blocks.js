import { ObservableStore } from '@metamask/obs-store';

export default class BlockController {
  constructor(opts = {}) {
    const { blockTracker, provider } = opts;

    const initState = { blocks: [] };
    this.store = new ObservableStore(initState);

    blockTracker.removeListener('latest', (blockNumber) => {
      const { blocks } = this.store.getState();
      provider
        .sendAsync({
          jsonrpc: '2.0',
          method: 'eth_getBlockByNumber',
          params: [blockNumber, false],
          id: 1,
        })
        .then((res) => {
          blocks.push(res.result);
          this.store.updateState({
            blocks,
          });
        });
    });
    blockTracker.addListener('latest', (blockNumber) => {
      const { blocks } = this.store.getState();
      provider
        .sendAsync({
          jsonrpc: '2.0',
          method: 'eth_getBlockByNumber',
          params: [blockNumber, false],
          id: 1,
        })
        .then((res) => {
          blocks.push(res.result);
          this.store.updateState({
            blocks,
          });
        });
    });
  }

  resetBlockList = () => {
    this.store.updateState({
      blocks: {},
    });
  };
}
