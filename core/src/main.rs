use clap::Parser;
use hypernova_core::{Blockchain, P2PNetwork, init};
use log::{info, error};

#[derive(Parser)]
#[clap(name = "HyperNova Node")]
#[clap(author = "HyperNova Chain Team")]
#[clap(version = hypernova_core::VERSION)]
#[clap(about = "HyperNova Chain Node Implementation", long_about = None)]
struct Cli {
    #[clap(long, default_value = "8545")]
    rpc_port: u16,
    
    #[clap(long, default_value = "30303")]
    p2p_port: u16,
    
    #[clap(long, default_value = "data")]
    data_dir: String,
    
    #[clap(long)]
    validator: bool,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize the core library
    init()?;
    
    // Parse command line arguments
    let args = Cli::parse();
    
    info!("Starting HyperNova Chain node v{}", hypernova_core::VERSION);
    info!("Data directory: {}", args.data_dir);
    
    // Initialize the blockchain
    let blockchain = match Blockchain::new(&args.data_dir) {
        Ok(chain) => chain,
        Err(e) => {
            error!("Failed to initialize blockchain: {}", e);
            return Err(e.into());
        }
    };
    
    // Initialize the P2P network
    let network = P2PNetwork::new(args.p2p_port)?;
    
    // Start the node
    if args.validator {
        info!("Running as validator node");
        // Start validator services
    } else {
        info!("Running as full node");
        // Start full node services
    }
    
    // Start RPC server
    info!("RPC server listening on port {}", args.rpc_port);
    
    // Keep the main thread running
    loop {
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    }
}