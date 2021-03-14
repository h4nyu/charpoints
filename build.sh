#!/bin/shell

# docker buildx build --platform linux/arm/v7,linux/arm64,linux/amd64 --tag $DOCKER_REGISTRY/charpoints/app --push ./app
docker buildx build --platform linux/arm/v7,linux/arm64,linux/amd64 --tag $DOCKER_REGISTRY/charpoints/app --push ./app
