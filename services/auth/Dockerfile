# Built from the repo root so the Maven reactor can resolve the shared module:
#   docker build -f services/auth/Dockerfile -t ghcr.io/<owner>/cgeek-auth:<tag> .
# The Oracle VM is Arm64, so CI builds linux/arm64 with buildx.

FROM maven:3-eclipse-temurin-25 AS build
WORKDIR /src
COPY pom.xml .
COPY shared/pom.xml shared/
COPY services/auth/pom.xml services/auth/
RUN mvn -q -pl services/auth -am dependency:go-offline
COPY shared/src shared/src
COPY services/auth/src services/auth/src
RUN mvn -q -pl services/auth -am -DskipTests package

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /src/services/auth/target/*.jar app.jar
USER app
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
