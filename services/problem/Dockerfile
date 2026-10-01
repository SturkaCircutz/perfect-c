# Built from the repo root so the Maven reactor can resolve the shared module:
#   docker build -f services/problem/Dockerfile -t ghcr.io/<owner>/cgeek-problem:<tag> .
# The Oracle VM is Arm64, so CI builds linux/arm64 with buildx.

FROM maven:3-eclipse-temurin-25 AS build
WORKDIR /src
COPY pom.xml .
COPY shared/pom.xml shared/
COPY services/problem/pom.xml services/problem/
RUN mvn -q -pl services/problem -am dependency:go-offline
COPY shared/src shared/src
COPY services/problem/src services/problem/src
RUN mvn -q -pl services/problem -am -DskipTests package

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /src/services/problem/target/*.jar app.jar
USER app
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
