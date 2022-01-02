FROM elixir:1.12.3-alpine as build

RUN apk add --update git build-base nodejs npm

RUN mix do local.hex --force, local.rebar --force

RUN mkdir /app
RUN echo $(pwd)
ENV MIX_ENV=prod

COPY ./ /app
WORKDIR /app
RUN echo $(ls)
RUN mix deps.get --only $MIX_ENV
RUN mix deps.compile
# RUN npm install
# RUN npm run build

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
RUN echo $(pwd)
RUN echo $(ls)

# @TODO: More secure ?
# RUN chown -R nobody: /app
# USER nobody

ENV HOME=/app
CMD ["bin/clab", "start"]
