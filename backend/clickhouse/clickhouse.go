package clickhouse

import (
	"context"
	"crypto/tls"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/ClickHouse/clickhouse-go/v2"
	"github.com/ClickHouse/clickhouse-go/v2/lib/driver"
	"github.com/golang-migrate/migrate/v4"
	clickhouseMigrate "github.com/golang-migrate/migrate/v4/database/clickhouse"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/highlight-run/highlight/backend/projectpath"
	e "github.com/pkg/errors"
	log "github.com/sirupsen/logrus"
)

type Client struct {
	conn driver.Conn
}

var (
	ServerAddr      = os.Getenv("CLICKHOUSE_ADDRESS")
	PrimaryDatabase = os.Getenv("CLICKHOUSE_DATABASE") // typically 'default', clickhouse needs an existing database to handle connections
	TestDatabase    = os.Getenv("CLICKHOUSE_TEST_DATABASE")
	Username        = os.Getenv("CLICKHOUSE_USERNAME")
	Password        = os.Getenv("CLICKHOUSE_PASSWORD")
)

func NewClient(dbName string) (*Client, error) {
	conn, err := clickhouse.Open(getClickhouseOptions(dbName))

	return &Client{
		conn: conn,
	}, err
}

func RunMigrations(ctx context.Context, dbName string) {
	options := getClickhouseOptions(dbName)
	db := clickhouse.OpenDB(options)
	driver, err := clickhouseMigrate.WithInstance(db, &clickhouseMigrate.Config{
		MigrationsTableEngine: "MergeTree",
		MultiStatementEnabled: true,
	})

	log.WithContext(ctx).Printf("Starting clickhouse migrations for db: %s", dbName)

	if err != nil {
		log.WithContext(ctx).Fatalf("Error creating clickhouse db instance for migrations: %v", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file:///%s/clickhouse/migrations", projectpath.GetRoot()),
		dbName,
		driver,
	)

	if err != nil {
		log.WithContext(ctx).Fatalf("Error creating clickhouse db instance for migrations: %v", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.WithContext(ctx).Fatalf("Error running clickhouse migrations: %v", err)
	} else {
		log.WithContext(ctx).Printf("Finished clickhouse migrations for db: %s", dbName)
	}
}

func (client *Client) HealthCheck(ctx context.Context) error {
	var v uint8
	err := client.conn.QueryRow(
		ctx,
		`SELECT 1`,
	).Scan(&v)
	if err != nil {
		return err
	} else if v != 1 {
		return e.New("invalid value returned from clickhouse")
	}
	return nil
}

func useTLS() bool {
	return strings.HasSuffix(ServerAddr, "9440")
}

func getClickhouseOptions(dbName string) *clickhouse.Options {
	options := &clickhouse.Options{
		Addr: []string{ServerAddr},
		Auth: clickhouse.Auth{
			Database: dbName,
			Username: Username,
			Password: Password,
		},
		DialTimeout: time.Duration(25) * time.Second,
	}

	if useTLS() {
		options.TLS = &tls.Config{}
	}

	return options
}
