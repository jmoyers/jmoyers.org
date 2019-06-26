resource "digitalocean_ssh_key" "default" {
  name       = "default"
  public_key = file(".ssh/id_rsa.pub")
}

resource "digitalocean_droplet" "node01" {
  image = "ubuntu-16-04-x64"
  name = "node01"
  region = "sfo1"
  size = "s-1vcpu-1gb"
  private_networking = false
  ssh_keys = [digitalocean_ssh_key.default.fingerprint]
}

output "public_ip" {
  value = digitalocean_droplet.node01.ipv4_address
}

resource "digitalocean_firewall" "default" {
  name = "web-dns-ping-ssh"

  droplet_ids = [digitalocean_droplet.node01.id]

  inbound_rule {
    protocol           = "tcp"
    port_range         = "22"
    source_addresses   = [var.LOCAL_PUBLIC_IP]
  }

  inbound_rule {
    protocol           = "tcp"
    port_range         = "80"
    source_addresses   = ["0.0.0.0/0", "::/0"]
  }
  
  # fetch packages, docker images and so on
  outbound_rule {
    protocol                = "tcp"
    port_range              = "80"
    destination_addresses   = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol                = "tcp"
    port_range              = "443"
    destination_addresses   = ["0.0.0.0/0", "::/0"]
  }

  # static site
  inbound_rule {
    protocol           = "tcp"
    port_range         = "8000"
    source_addresses   = ["0.0.0.0/0", "::/0"]
  }

  # ghost blog
  inbound_rule {
    protocol           = "tcp"
    port_range         = "2368"
    source_addresses   = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol           = "tcp"
    port_range         = "443"
    source_addresses   = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol           = "icmp"
    source_addresses   = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol                = "tcp"
    port_range              = "53"
    destination_addresses   = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol                = "udp"
    port_range              = "53"
    destination_addresses   = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol                = "icmp"
    destination_addresses   = ["0.0.0.0/0", "::/0"]
  }
}

resource "null_resource" "post_apply" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "scripts/inventory ${digitalocean_droplet.node01.ipv4_address}"
  }
}
