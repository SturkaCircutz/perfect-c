# Built from the repo root:
#   docker build -f judge/Dockerfile -t ghcr.io/<owner>/cgeek-judge:<tag> .
#
# Unlike the services this image is NOT alpine: AddressSanitizer and UBSan behave badly
# against musl, and the proposal's gcc 14 toolchain is what the verdicts are defined by.
# Pinning the compiler version matters - a gcc upgrade can change UB diagnostics and so
# change verdicts on problems that were already accepted.

FROM maven:3-eclipse-temurin-25 AS build
WORKDIR /src
COPY pom.xml .
COPY shared/pom.xml shared/
COPY judge/pom.xml judge/
RUN mvn -q -pl judge -am dependency:go-offline
COPY shared/src shared/src
COPY judge/src judge/src
RUN mvn -q -pl judge -am -DskipTests package

FROM debian:trixie-slim
# TODO: pin exact gcc and binutils versions once the base image is chosen for real.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      gcc-14 libasan8 libubsan1 util-linux openjdk-25-jre-headless \
 && ln -s /usr/bin/gcc-14 /usr/local/bin/gcc \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN useradd --system --no-create-home --shell /usr/sbin/nologin judge
COPY --from=build /src/judge/target/*.jar app.jar

# /work is a tmpfs mount supplied by the pod spec; the root filesystem is read only.
VOLUME ["/work"]
USER judge
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=50", "-jar", "app.jar"]
