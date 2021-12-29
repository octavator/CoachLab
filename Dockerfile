FROM elixir:1.12.3-alpine as build

RUN apk add --update git build-base nodejs npm

RUN mix do local.hex --force, local.rebar --force

RUN mkdir /app
RUN echo $(pwd)
ENV MIX_ENV=prod

COPY ./ /app
WORKDIR /app
RUN echo $(ls)
# COPY config config
RUN mix deps.get --only $MIX_ENV
RUN mix deps.compile
# RUN npm install
# RUN npm run build

# COPY priv priv
# COPY lib lib
RUN mix compile
# COPY rel rel
RUN mix release

FROM alpine:3.14.2

# install runtime dependencies
RUN apk upgrade --no-cache && apk add --no-cache postgresql-client bash openssl libgcc libstdc++ ncurses-libs

EXPOSE 4001
ENV MIX_ENV=prod

# prepare app directory
RUN mkdir /app
WORKDIR /app

# copy release to app container
COPY --from=build /app/_build/prod/rel/clab .
RUN echo $(ls ./bin)
RUN echo $(pwd)
# COPY entrypoint.sh .
# RUN chown -R nobody: /app
# USER nobody

ENV HOME=/app
CMD ["bin/clab", "start"]


# ENV MIX_HOME=/opt/mix
# # RUN apk add --no-cache python2 g++ make
# EXPOSE 4001
# ENV REPLACE_OS_VARS=true \
#     PORT=4001
# WORKDIR /CoachLab
# COPY . .
# RUN mix local.hex --force && mix local.rebar --force
# RUN export MIX_ENV=prod && \
#     rm -Rf _build
# RUN apt-get update && apt-get upgrade
# RUN apt-get install -y npm
# RUN mix deps.get
# RUN npm run build

# CMD ["iex", "-S", "mix"]

# FROM elixir:1.12.3
# ENV MIX_HOME=/opt/mix
# # RUN apk add --no-cache python2 g++ make
# EXPOSE 4001
# ENV REPLACE_OS_VARS=true \
#     PORT=4001
# WORKDIR /CoachLab
# COPY . .
# RUN mix local.hex --force && mix local.rebar --force
# RUN export MIX_ENV=prod && \
#     rm -Rf _build
# RUN apt-get update && apt-get upgrade
# RUN apt-get install -y npm
# RUN mix deps.get
# RUN npm run build

# CMD ["iex", "-S", "mix"]


# RUN yarn install --production

# FROM alpine


# COPY --from=build /build/_build/${MIX_ENV}/rel/* ./
# CMD ["_build/prod/rel/clab/bin/clab", "start"]
# #Set environment variables and expose port
# EXPOSE 4001
# ENV REPLACE_OS_VARS=true \
#     PORT=4001

# #Copy and extract .tar.gz Release file from the previous stage
# COPY --from=build /export/ .

# #Change user
# USER default

# #Set default entrypoint and command
# ENTRYPOINT ["/opt/app/bin/clab"]
# CMD ["foreground"]
# # CMD ["iex", "-S", "mix"]
