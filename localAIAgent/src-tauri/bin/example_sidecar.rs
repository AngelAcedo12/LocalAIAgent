fn main() {
    println!("Sidecar iniciado!");
    loop {
        std::thread::sleep(std::time::Duration::from_secs(5));
        println!("Sidecar running...");
    }
}
