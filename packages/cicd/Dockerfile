FROM alpine
RUN apk add chromium
RUN wget https://github.com/johns10/userdocs_clients/releases/download/%40userdocs%2Fcicd%401.0.8/userdocs-cicd-alpine
ADD .env .
RUN chmod +x userdocs-cicd-alpine
