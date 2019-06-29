# Create a new domain
resource "digitalocean_domain" "jmoyers" {
  name = "jmoyers.org"
}

# imported
resource "digitalocean_record" "ns1" {
  domain = "${digitalocean_domain.jmoyers.name}"
  type   = "NS"
  name   = "@"
  value  = "ns1.digitalocean.com."
	ttl		 = 1800
}

# imported
resource "digitalocean_record" "ns2" {
  domain = "${digitalocean_domain.jmoyers.name}"
  type   = "NS"
  name   = "@"
  value  = "ns2.digitalocean.com."
	ttl		 = 1800
}

# imported
resource "digitalocean_record" "ns3" {
  domain = "${digitalocean_domain.jmoyers.name}"
  type   = "NS"
  name   = "@"
  value  = "ns3.digitalocean.com."
	ttl		 = 1800
}

# imported
resource "digitalocean_record" "bare" {
  domain = "${digitalocean_domain.jmoyers.name}"
  type   = "A"
  name   = "@"
  value  = digitalocean_droplet.node01.ipv4_address
	ttl		 = 1800
}

# imported
resource "digitalocean_record" "www" {
  domain = "${digitalocean_domain.jmoyers.name}"
  type   = "A"
  name   = "www"
  value  = digitalocean_droplet.node01.ipv4_address
	ttl		 = 1800
}

# imported
resource "digitalocean_record" "mx1" {
  domain = "${digitalocean_domain.jmoyers.name}"
  type   = "MX"
  name   = "@"
  value  = "aspmx.l.google.com."
	ttl		 = 1800
  priority = 1
}

# imported
resource "digitalocean_record" "mx2" {
  domain = "${digitalocean_domain.jmoyers.name}"
  type   = "MX"
  name   = "@"
  value  = "aspmx2.googlemail.com."
	ttl		 = 1800
  priority = 10
}

# imported
resource "digitalocean_record" "mx3" {
  domain = "${digitalocean_domain.jmoyers.name}"
  type   = "MX"
  name   = "@"
  value  = "aspmx3.googlemail.com."
	ttl		 = 1800
  priority = 10
}

# imported
resource "digitalocean_record" "altmx1" {
  domain = "${digitalocean_domain.jmoyers.name}"
  type   = "MX"
  name   = "@"
  value  = "alt1.aspmx.l.google.com."
	ttl		 = 1800
  priority = 5
}

# imported
resource "digitalocean_record" "altmx2" {
  domain = "${digitalocean_domain.jmoyers.name}"
  type   = "MX"
  name   = "@"
  value  = "alt2.aspmx.l.google.com."
	ttl		 = 1800
  priority = 5
}
