# Built from the repo root so the Maven reactor can resolve the shared module:
#   docker build -f gateway/Dockerfile -t ghcr.io/<owner>/cgeek-gateway:<tag> .
# The Oracle VM is Arm64, so CI builds linux/arm64 with buildx.

FROM maven:3-eclipse-temurin-25 AS build
WORKDIR /src
COPY pom.xml .
COPY shared/pom.xml shared/
COPY gateway/pom.xml gateway/
RUN mvn -q -pl gateway -am dependency:go-offline
COPY shared/src shared/src
COPY gateway/src gateway/src
RUN mvn -q -pl gateway -am -DskipTests package

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /src/gateway/target/*.jar app.jar
USER app
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
