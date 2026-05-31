package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"time"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/grpclog"

	// gw "gen/go" // Update
	gw "main/gen/go" // Update
)

var (
	// command-line options:
	// gRPC server endpoint
	grpcServerEndpoint = flag.String("grpc-server-endpoint", "back-end:50051", "gRPC server endpoint")
)

func run() error {
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// Register gRPC server endpoint
	// Note: Make sure the gRPC server is running properly and accessible
	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}
	err := gw.RegisterSan11PlatformHandlerFromEndpoint(ctx, mux, *grpcServerEndpoint, opts)
	if err != nil {
		return err
	}
	mux.HandlePath("GET", "/v1/healthz", healthzHandler(opts))

	// Start HTTP server (and proxy calls to gRPC server endpoint)
	fmt.Println("Starting HTTP server on port 8081")
	return http.ListenAndServe(":8081", mux)
}

func healthzHandler(opts []grpc.DialOption) runtime.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request, pathParams map[string]string) {
		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()

		dialOpts := append([]grpc.DialOption{}, opts...)
		dialOpts = append(dialOpts, grpc.WithBlock())
		conn, err := grpc.DialContext(ctx, *grpcServerEndpoint, dialOpts...)
		if err != nil {
			writeHealthz(w, http.StatusServiceUnavailable, map[string]string{
				"status":  "unavailable",
				"gateway": "ok",
				"backend": "unavailable",
				"error":   err.Error(),
			})
			return
		}
		defer conn.Close()

		writeHealthz(w, http.StatusOK, map[string]string{
			"status":  "ok",
			"gateway": "ok",
			"backend": "ok",
		})
	}
}

func writeHealthz(w http.ResponseWriter, statusCode int, payload map[string]string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		grpclog.Errorf("failed to write healthz response: %v", err)
	}
}

func main() {
	flag.Parse()

	if err := run(); err != nil {
		grpclog.Fatal(err)
	}
}
