### Issue

[https://github.com/paritytech/parity-ethereum/issues/9660](https://github.com/paritytech/parity-ethereum/issues/9660)

### Setup

#### Run Parity Ethereum Node

* Install Parity Ethereum dependencies
  ```
  bash parity-dependencies.sh
  ```
* Install [Parity Ethereum](https://github.com/paritytech/parity-ethereum)
  * Build from source
    * Clone latest
      ```
      mkdir -p ~/code/paritytech && cd ~/code/paritytech;
      git clone https://github.com/paritytech/parity-ethereum;
      cd parity-ethereum;
      ```
    * Build
      * Stable
        * Clean stable. Build in release mode to generate executable in ./target/release subdirectory
          ```
          rustup default stable;
          git checkout stable;
          cargo clean;
          cargo build --release --features final
          ```
      * Nightly - [IGNORE as use 'stable' until issue #10013 resolved](https://github.com/paritytech/parity-ethereum/issues/10013#issuecomment-444505679)
        * Clean nightly. Build in release mode to generate executable in ./target/release subdirectory
          ```
          rustup default nightly;
          git checkout master;
          cargo clean;
          cargo build --release --features final
          ```
    * Run Parity Ethereum
      ```
      ./target/release/parity
      ```
      * Note that Database (DB) is stored at: ~/Library/Application\ Support/io.parity.ethereum/

* [Create Account](https://wiki.parity.io/CLI-Sub-commands#account-new)
	* Create account on Kovan network. Enter:
    ```
    ./target/release/parity --chain dev \
      --base-path ~/Library/Application\ Support/io.parity.ethereum/ \
      --db-path ~/Library/Application\ Support/io.parity.ethereum/chains \
      --keys-path ~/Library/Application\ Support/io.parity.ethereum/keys \
      --config dev \
      --keys-iterations 10240 \
      account new
    ```
	* Enter a password at the prompt (i.e. `password`)
	* Record the associated Ethereum Address that is generated (i.e. `0xb2d354a6b5635e9d5837b8da3fc17fa64c0fd006`)

* Create a password file to store the demonstration password for the account for Kovan:
  ```
  mkdir -p ~/Library/Application\ Support/io.parity.ethereum/passwords/kovan/;
  echo "password" > ~/Library/Application\ Support/io.parity.ethereum/passwords/kovan/password-0xb2d354a6b5635e9d5837b8da3fc17fa64c0fd006.txt
  ```

* Create a password file to store the demonstration password for the account for Dev:
  ```
  mkdir -p ~/Library/Application\ Support/io.parity.ethereum/passwords/development/;
  echo "password" > ~/Library/Application\ Support/io.parity.ethereum/passwords/development/password-0x79abf20c81485508654be231b1b71905dd7acb57.txt
  ```
* Request Kovan Ethers from the Parity Kovan Faucet to be sent to the account: https://github.com/kovan-testnet/faucet
* Run Parity Ethereum and Synchronise with Kovan chain

  ```
  cd ~/code/src/paritytech/parity-ethereum;
  ./target/release/parity --chain kovan \
    --base-path ~/Library/Application\ Support/io.parity.ethereum/ \
    --db-path ~/Library/Application\ Support/io.parity.ethereum/chains \
    --keys-path ~/Library/Application\ Support/io.parity.ethereum/keys \
    --jsonrpc-interface "0.0.0.0" \
    --jsonrpc-apis all \
    --jsonrpc-hosts all \
    --jsonrpc-cors all \
    --ws-port 8546 \
    --force-sealing \
    --no-persistent-txqueue \
    --gas-floor-target 6666666 \
    --config dev \
    --unlock 0xb2d354a6b5635e9d5837b8da3fc17fa64c0fd006 \
    --password ~/Library/Application\ Support/io.parity.ethereum/passwords/kovan/password-0xb2d354a6b5635e9d5837b8da3fc17fa64c0fd006.txt \
    --min-gas-price 1 \
    --logging sync=error,engine=trace,own_tx=trace,tx_queue=trace,miner=trace
  ```
* Notes:
  * `--ws-port 8546` - default port, but make explicit for reference, use web3.js with websockets to connect so may view event logs
  * `--min-gas-price 1` - so don't run out of Koven Ethers too quickly
  * `--no-persistent-txqueue` - remove stuck transactions from the tx pool
  * `--gas-floor-target 6666666` - run sealing nodes with this to accept transactions with more than 4.7 million gas

* References: 
  * logs - https://ethereum.stackexchange.com/questions/3331/how-to-make-parity-write-logs
  * no-persistent-queue & gas-floor-target - https://github.com/paritytech/parity-ethereum/issues/6342#issuecomment-323711118

#### Run Dapp

* Run Web3.js 1.0 dapp to send tx to Parity Ethereum node
  ```
  yarn; yarn run start;
  ```