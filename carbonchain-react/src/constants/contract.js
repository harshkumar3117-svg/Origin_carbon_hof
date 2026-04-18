export const CONTRACT_ADDRESS = '0xcc2012ff4f01e8a3b5b8a97cf3a9e75c5d714f3a';

export const CONTRACT_ABI = [
  { "inputs": [{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],
    "name":"buyCredits","outputs":[],"stateMutability":"payable","type":"function" },
  { "inputs": [{"name":"account","type":"address"}],
    "name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function" },
  { "inputs": [],
    "name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function" },
  { "inputs": [{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],
    "name":"transfer","outputs":[{"name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function" },
  { "anonymous":false,"inputs":[
      {"indexed":true,"name":"buyer","type":"address"},
      {"indexed":false,"name":"amount","type":"uint256"},
      {"indexed":false,"name":"ethPaid","type":"uint256"}],
    "name":"CreditsPurchased","type":"event" }
];
