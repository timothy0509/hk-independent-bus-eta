FROM oven/bun:1.2

# Install Node.js for pre-rendering (Puppeteer compatibility)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

WORKDIR /app

RUN git config --global --add safe.directory /app
