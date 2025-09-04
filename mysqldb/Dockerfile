FROM mysql:8.0

# Copy init script
COPY ./init_db.sql /docker-entrypoint-initdb.d/

# Ensure correct ownership for mysql user
RUN chown -R mysql:mysql /docker-entrypoint-initdb.d/

# Switch to mysql user (optional, mysql:8.0 already defaults to this)
USER mysql

# Run MySQL (the entrypoint of the base image already does this)
CMD ["mysqld"]
