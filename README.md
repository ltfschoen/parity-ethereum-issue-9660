### Issue

[https://github.com/paritytech/parity-ethereum/issues/9660](https://github.com/paritytech/parity-ethereum/issues/9660)

### Setup

#### Run Parity Ethereum Node

* Install Parity Ethereum dependencies
  * Copy the following to parity-dependencies.sh. Run with `bash parity-dependencies.sh`
    ```
    #!/usr/bin/env bash

    # Parity Ethereum Dependencies
    #
    # References:
    # - https://github.com/paritytech/parity-ethereum
    # - https://wiki.parity.io/Setup

    COLOR_WHITE=$(tput setaf 7);
    COLOR_MAGENTA=$(tput setaf 5);
    FONT_BOLD=$(tput bold);
    FONT_NORMAL=$(tput sgr0);

    prompt_install () {
      while true; do
        echo
        read -p "Proceed with $1 (Y/N)? > " yn
        case $yn in
          [Yy]* ) return 0;;
          [Nn]* ) return 1;;
          * ) echo "Try again. Please answer yes or no.";;
        esac
      done
    }

    echo
    echo -e "$COLOR_WHITE $FONT_BOLD Parity Ethereum Dependencies Setup...$FONT_NORMAL";
    echo
    echo -e "  Installing Rust...";
    echo
    curl https://sh.rustup.rs -sSf | sh -s -- -y;
    rustup update nightly;
    rustup update stable;
    echo
    echo -e "  Switching to Rust Nightly...";
    rustup default nightly;
    cargo install --git https://github.com/alexcrichton/wasm-gc --force;
    cargo install --git https://github.com/pepyakin/wasm-export-table.git --force;

    if [[ "$OSTYPE" == "darwin"* ]]; then
      echo
      echo -e "  Mac OS Detected...";

      APP="Homebrew"
      echo
      echo -e "$COLOR_MAGENTA $FONT_BOLD Searching for $APP...$COLOR_WHITE $FONT_NORMAL";
      if brew 2>&1 | grep Example; then
        echo -e "  Skipping, $APP already installed";
      else
        if prompt_install $APP; then
          echo -e "  Installing $APP...";
          /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)";
          export PATH="/usr/local/bin:/usr/local/sbin:~/bin:$PATH"
          brew doctor
          brew update
        fi
      fi

      APP="Git"
      echo
      echo -e "$COLOR_MAGENTA $FONT_BOLD Searching for $APP...$COLOR_WHITE $FONT_NORMAL";
      if git 2>&1 | grep usage; then
        echo -e "  Skipping, $APP already installed";
      else
        if prompt_install $APP; then
          echo -e "  Installing $APP latest version...";
          brew install git; brew upgrade git;
          git config --global color.ui auto;
          echo -e "  Please enter your username for $APP Config:";
          read -p "    Username > " uservar
          echo -e "  Please enter your email for $APP Config:";
          read -p "    Email >" emailvar
          git config --global user.name "$uservar";
          git config --global user.email "$emailvar";
          echo
          echo -e "  $APP Config updated with your credentials";
        fi
      fi

      echo
      echo -e "  Installing CMake, Clang, pkg-config, OpenSSL, and Git for Mac OS...";
      brew install openssl; brew upgrade openssl;
      brew install cmake; brew upgrade cmake;
      brew install pkg-config; brew upgrade pkg-config;
      brew install clang; brew upgrade clang;
    else
      prompt_install "Linux OS dependencies installation"
      echo -e "  Installing CMake, pkg-config, Libssl, Git, GNU Make Utility (`make`), C (`gcc`) and C++ (`g++`) compiler for Linux OS...";
      sudo apt update;
      sudo apt upgrade;
      sudo apt install build-essential;
      sudo apt install -y cmake pkg-config libssl-dev git libudev-dev file
      echo -e "  Verify installation...";
      whereis gcc g++ make;
      gcc --version;
      make -v;
    fi
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
      * Clean nightly. Build in release mode to generate executable in ./target/release subdirectory
        ```
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