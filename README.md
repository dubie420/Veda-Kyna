# RebirthVault

**RebirthVault** is an Ethereum project for meaningful token burns. It acts as a vault that collects ETH and ERC20 tokens (intended for burning), and forwards them to a purpose-driven destination (such as a public good, charity, etc.) instead of a black hole.

## Purpose

Instead of destroying tokens forever, RebirthVault redirects "burned" value to a designated vault (`purposeVault`)—e.g., a community multisig, project treasury, or a charity. This enables "burn with meaning" and allows projects and users to symbolically burn tokens, while actually funding purposeful causes.

## Features

- **RebirthVault contract**: Accepts ETH (via `receive()`) and any ERC20 with `flushTokens()`, forwarding all to an immutable `purposeVault`.
- **RebirthVaultFactory**: Deploys vaults using deterministic CREATE2, allowing for vanity address generation and predicable vault addresses.
- **PurposeBurnToken**: Example ERC20 token with a 2% burn-on-transfer fee redirected to the vault.
- **Deployment scripts**: For deploying factory, vault, and token; saves addresses to JSON.
- **Salt brute-forcer**: Script to find vanity vault addresses (e.g. starting with `0x0000`).
- **Test suite**: Sample tests for vault and token mechanics.

---

## How to Deploy

### 1. Install dependencies

```bash
npm install
```

### 2. Deploy the Factory and Vault

Edit `scripts/deploy_factory_and_vault.js` to set your `purposeVault` address.

```bash
npx hardhat run scripts/deploy_factory_and_vault.js
```

This deploys the factory and vault using CREATE2, and saves addresses in `deployments/addresses.json`.

### 3. Deploy the Token

```bash
npx hardhat run scripts/deploy_token.js
```

This deploys the PurposeBurnToken pointed at your vault.

### 4. (Optional) Brute Force Vanity Salt

To find a salt for a vanity address (e.g., `0x0000...`):

```bash
node scripts/brute_force_salt.js
```

Set your desired prefix in the script.

---

## Binding to ENS

Once your vault is deployed, you can bind it to an ENS name like `burnwithmeaning.eth` for easy reference:

1. Go to [app.ens.domains](https://app.ens.domains/).
2. Register your ENS name if you haven't already.
3. Set the "ETH Address" record to your vault address from `deployments/addresses.json`.

---

## How the Token Burn Mechanism Works

- Every transfer of `PurposeBurnToken` sends 2% of the transferred amount to the vault address as a "symbolic burn".
- The vault forwards all received tokens/ETH to the `purposeVault` destination.
- The vault can be referenced as having "burned with meaning"—the value is redirected for a public purpose.

---

## Example Use

- Deploy your own vault and token.
- Tell users to send tokens to the vault, or burn via the token's transfer mechanism.
- Use the vault for a community cause, charity, or project funding.
- Bind to an ENS name for social proof.

---

## Security

- The vault's destination is immutable.
- The vault cannot be upgraded or redirected after deployment.
- The factory allows for deterministic deployments and vanity address generation.

---

## License

MIT