resource "digitalocean_ssh_key" "default" {
  name       = "default"
  public_key = file(".ssh/id_rsa.pub")
}

resource "digitalocean_droplet" "node01" {
	image = "ubuntu-16-04-x64"
	name = "node01"
	region = "sfo1"
	size = "512mb"
	private_networking = false
	ssh_keys = [digitalocean_ssh_key.default.fingerprint]

  connection {
    type = "ssh"
    user = "root"
    private_key = file(".ssh/id_rsa")
    host = self.ipv4_address
  }

  provisioner "remote-exec" {
    inline = [
      "apt update",
      "apt upgrade",
      "apt install docker.io",
      "systemctl start docker",
      "systemctl enable docker"
    ]
  }
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

	inbound_rule {
		protocol           = "tcp"
		port_range         = "8000"
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
