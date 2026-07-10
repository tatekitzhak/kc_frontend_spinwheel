# Implement a UI Form Layouts by using Keycloak
# Authentication and access management platforms, Identity and Access Management (IAM) tools 

## React + TypeScript + Vite + Tailwind CSS

## Run the project non-docker way.


#### Tutor
- https://dorokhovich.com/blog/keycloak-nginx-cluster
- https://www.youtube.com/watch?v=Kv3hhuyrpXg
- https://www.keycloak.org/server/reverseproxy
- https://rogitel.com/keycloak-installing-with-nginx-troubleshooting/s
####

*******************************************************************
#   How to Configuration and Run the project on AWS EC2 server:  **
*******************************************************************
# How to Configuration and Run the project on AWS EC2 server:

# Keycloak Admin Console
- Create realm
- Create client - Login settings:
1. Root URL:`https://[domain_name]:4000` - The base URL of your application.
2. Home URL:`https://[domain_name]:4000`- Where the auth server redirects users if they click a "Back to Application" link.
3. Valid redirect URIs:`https://[domain_name]:4000/*` - Crucial. The specific paths where the auth server is allowed to send the login response. The wildcard * allows for various routes.
4. Valid post logout redirect URIs:`https://[domain_name]:4000/*` - Where the user is sent after logging out.
5. Web origins: `https://[domain_name]:4000` - This enables CORS. It allows your React app's domain to make JavaScript requests to the auth server.
- Create user: 

# Keycloak Server Admin
1. Update `docker-compose.yml` file
- KC_HOSTNAME_ADMIN_URL: https://[IP_ADDR_OR_DOMAIN_NAME]:8443
- KC_HOSTNAME_URL: https://[IP_ADDR_OR_DOMAIN_NAME]:8443

2. Nginx 
- Go to directory: `/nginx/config/` at file: `localhost.conf`
- Update: `server_name [IP_ADDR_OR_DOMAIN_NAME]`; 
```bash
 server {
        listen 80 default_server;
        server_name [IP_ADDR_OR_DOMAIN_NAME];
        return 301 https://[IP_ADDR_OR_DOMAIN_NAME]:8443$request_uri;
    }

    server {
            listen 443 ssl;
            server_name [IP_ADDR_OR_DOMAIN_NAME];
            ssl_certificate     /etc/nginx/ssl/localhost/localhost.crt;
            ssl_certificate_key /etc/nginx/ssl/localhost/localhost.key;
```

3. Client Keycloak
- The client account is represents an application or service that trusts Keycloak to authenticate users or authenticate itself.
- Clients are applications and services that can request authentication of a user:

```bash
Root URL: 
Home URL:
Valid redirect URIs:
Valid post logout redirect URIs:
Web origins:
```

  Field,     Value,                    Description
- Root URL: `https://localhost:4000` - The base URL of your application.
- Home URL: `https://localhost:5173`- Where the auth server redirects users if they click a "Back to Application" link.
- Valid redirect URIs: `https://localhost:5173/*` - Crucial. The specific paths where the auth server is allowed to send the login response. The wildcard * allows for various routes.
- Valid post logout redirect URIs: `https://localhost:5173/*` - Where the user is sent after logging out.
- Web origins: `https://localhost:5173` - This enables CORS. It allows your React app's domain to make JavaScript requests to the auth server.


# FrontEnd - React
*************************
* Build React Artifacts *
* FIRST RUN:            *
* `npm run build`       *
*************************
1. Ensure a Dockerfile and Terraform is configured correctly
2. Modify an .env file is compatible correctly against AWS EC2 server

3. `docker network create kc_shared_central_nginx_proxy_network`

4. SSL
- Go to directory: `/nginx/certs/` and run:

```bash
***** FOR LOCALHOST ****
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 -days 365 \
  -subj "/CN=18.223.255.165" -extensions EXT -config <( \
   printf "[dn]\nCN=18.223.255.165\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=IP:18.223.255.165\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

***** FOR PROD ****
openssl req -x509 -out prod.crt -keyout prod.key \
  -newkey rsa:2048 -nodes -sha256 -days 365 \
  -subj "/CN=3.23.113.237" -extensions EXT -config <( \
   printf "[dn]\nCN=3.23.113.237\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=IP:3.23.113.237\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
  ```

4. npm artifacts
- `npm run clean`
- `npm run build`
 

5. docker artifacts
- remove old and unused image from docker repositories
- `open -a Docker`

6. Run Terraform to create docker image artifact
- Go to /terraform/ directory and
- `terraform init`
- `terraform fmt`
- `terraform validate`
- `terraform plan`
- `terraform apply -auto-approve`
- `terraform destroy -auto-approve`

7. Deploy on EC2: `docker pull [repository_name]:[version]`
- To validate if your image has created: `docker images`
- Run container:
```bash
docker run -d \
--name abcd \
-p 4000:443 \
ranitzahak/tr-kc-spindraw-img:v1
```

- To list the running container: `docker ps` 
- Navigated to `https://[IP-Address-or-Domain-Name]:4000/`


## Keycloak handles : Single Sign On

## Single Log Out

## login with social networks 
1. User tries to access the secure reactjs application 
2. Then user is redirected to the Keyclock server 
3. User authentication against Keyclock server
4. User is redirected back to the client application (reactjs) 

- Google 
- GitHub 
- Facebook 
- LinkedIn

## User Federation
- DataBase User Table
- NoSQL 

clean docker:
- sudo docker-compose down
- sudo docker system prune -f

run docker:
- sudo docker-compose up -d --remove-orphans
- sudo docker ps
- sudo docker exec ee3d31555276 curl -v https://localhost:8080

docker util:

find containrs ID:
- sudo docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"

Install vim:
-  sudo docker exec -u 0 -it f25d80c2dd30 sh -c "apk add vim"

Logs:
- docker logs -f keycloak


http://localhost:3000/#error=login_required&state=e29fb1f7-72d2-4685-a5c8-ec7d8f06c91e&iss=https%3A%2F%2Flocalhost%3A8443%2Frealms%2Fthemelinx

# Remove and clean dependencies

- npm cache clean -f
- rm -rf node_modules
- rm -rf package-lock.json
- npm cache verify


ERROR:

vendor-tJYGX_wu.js:70 
 GET https://18.223.255.165/keycloak/protected 401 (Unauthorized)

index-BwQ2shQi.js:2 Failed to fetch data: AxiosError: Request failed with status code 401
    at zb (vendor-tJYGX_wu.js:70:1087)
    at XMLHttpRequest.D (vendor-tJYGX_wu.js:70:5927)